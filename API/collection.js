const express = require('express'),
	router = express.Router(),
	Videos = require('../models/video.js'),
	request = require('request');

const Check = require('../models/check.js');

function getSort(title, filters) {
	if (title === '') {
		if (filters === 'desc') {
			return { title: 'desc' };
		} else if (filters === 'asc') {
			return { title: 'asc' };
		} else {
			return { seeds: 'desc' };
		}
	} else {
		if (filters === 'desc') {
			return { title: 'desc' };
		} else {
			return { title: 'asc' };
		}
	}
}

function queryMongoose(title, filters) {
	let query = {};

	if (filters) {
		const type = filters.type && filters.type !== '' ? (filters.type === 'movie' ? filters.type : 'serie') : '';
		const genre = filters.genre && filters.genre !== '' ? filters.genre : '';
		const quality = filters.quality && filters.quality !== '' ? filters.quality : '';
		const season = filters.season && filters.season !== '' ? filters.season : '';
		const note = filters.note && filters.note !== '' ? filters.note : '';
		const noteActive = filters.noteActive ? filters.noteActive : false;
		const year = filters.year && filters.year !== '' ? filters.year : '';
		const yearActive = filters.yearActive ? filters.yearActive : false;

		if (title === '') {
			if (type !== '') {
				query.type = type;
			}
			if (genre !== '') {
				query.genres = genre !== 'Other' ? genre : 'N/A';
			}
			if (quality !== '') {
				query.quality = quality;
			}
			if (season !== '') {
				query.season = season;
			}
			if (note !== '' && noteActive) {
				query.rating = { $gt: note.min - 1, $lt: note.max + 1 };
			}
			if (year !== '' && yearActive) {
				query.year = { $gt: year.min - 1, $lt: year.max + 1 };
			}
			query = query !== {} ? query : '';
		} else {
			query.title = { $regex: title, $options: 'i' };
			if (type !== '') {
				query.type = type;
			}
			if (genre !== '') {
				query.genres = genre !== 'Other' ? genre : 'N/A';
			}
			if (quality !== '') {
				query.quality = quality;
			}
			if (season !== '') {
				query.season = season;
			}
			if (note !== '' && noteActive) {
				query.rating = { $gt: note.min, $lt: note.max };
			}
			if (year !== '' && yearActive) {
				query.year = { $gt: year.min, $lt: year.max };
			}
		}
		if (type === 'movie' && query.season) {
			delete query.season;
		}
		return query;
	} else {
		return title !== '' ? { title: { $regex: title, $options: 'i' } } : '';
	}
}

function testStatusCodeCoverBackground(image, video) {
	return new Promise((resolve, reject) => {
		request(image, (err, res) => {
			if (err || !res.statusCode) {
				resolve({ status: 404, video: video });
			}
			resolve({ status: res.statusCode, video: video });
		});
	});
}

function mapImagesForEachVideo(source, video, whichImage) {
	return new Promise((resolve, reject) => {
		testStatusCodeCoverBackground(source, video)
			.then((data) => {
				if (data.status === 200) {
					return video;
				} else {
					if (whichImage === 'cover') {
						video.cover = '/library/not-available.png';
					} else {
						video.background = '/library/not-available.png';
					}
					return video;
				}
			})
			.then((video) => {
				resolve(video);
			});
	});
}

// GET LIST  OF MOVIES / TV SHOW FROM DB BY NAME
router.post('/getCollectionByTitleForClient', (req, res) => {
	if (req.user) {
		Check.tokenExists(req.user.token)
			.then((response) => {
				if (response.status === 'error') {
					return res.status(401).send('HTTP401 Unauthorized : Bad API_TOKEN');
				} else {
					let filters = req.body.filters,
						query = queryMongoose(req.body.title, filters),
						sort =
							filters && filters.titleOrder !== ''
								? getSort(req.body.title, filters.titleOrder)
								: getSort(req.body.title, '');
					Videos.paginate(query, {
						page: req.body.page ? req.body.page : 1,
						limit: req.body.limit ? req.body.limit : 12,
						sort: sort
					})
						.then((json) => {
							if (json) {
								let promises = json.docs.map((video, index) => {
									return mapImagesForEachVideo(video.cover, video, 'cover')
										.then((video) => {
											return mapImagesForEachVideo(video.background, video, 'background');
										})
										.then((video) => {
											json.docs[index] = video;
										});
								});

								Promise.all(promises).then((result) => {
									res.json({ status: 'success', payload: json });
								});
							} else {
								res.json({ status: 'no_data' });
							}
						})
						.catch((err) => {
							if (err) {
								console.error(err);
								res.json({ status: 'error', content: err });
							}
						});
				}
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		return res.status(401).send('HTTP401 Unauthorized : Not logged.');
	}
});

// GET ALL GENRES IN DB FOR FILTERS
router.post('/getGenresInCollection', (req, res) => {
	if (req.user) {
		Check.tokenExists(req.user.token)
			.then((response) => {
				if (response.status === 'error') {
					return res.status(401).send('HTTP401 Unauthorized : Bad API_TOKEN');
				} else {
					Videos.distinct(
						'genres',
						req.body.title ? { title: { $regex: req.body.title, $options: 'i' } } : {}
					)
						.then((genres) => {
							genres = genres.map((genre) => (genre === 'N/A' ? 'Other' : genre));
							genres.sort();

							let allGenres = genres.map((genre) => ({ val: genre, selected: false }));
							res.json({ status: 'success', payload: allGenres });
						})
						.catch((err) => {
							if (err) {
								console.error(err);
								res.json({ status: 'error', content: err });
							}
						});
				}
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		return res.status(401).send('HTTP401 Unauthorized : Not logged.');
	}
});

function sortNumberDesc(a, b) {
	return b - a;
}

function sortNumberAsc(a, b) {
	return a - b;
}

// GET ALL QUALITY IN DB FOR FILTERS
router.post('/getQualityInCollection', (req, res) => {
	if (req.user) {
		Check.tokenExists(req.user.token)
			.then((response) => {
				if (response.status === 'error') {
					return res.status(401).send('HTTP401 Unauthorized : Bad API_TOKEN');
				} else {
					Videos.distinct(
						'quality',
						req.body.title ? { title: { $regex: req.body.title, $options: 'i' } } : {}
					)
						.then((quality) => {
							let find3d = quality.map((e, index) => (e === '3D' ? index : false));
							let index = find3d.find((e) => {
								if (e === 0) {
									return true;
								}
								if (e !== false) {
									return e;
								}
							});
							if (index !== undefined) {
								quality.splice(index, 1);
							}
							quality = quality.map((e) => {
								if (e && e.match(/(\d{3,4})/)[0]) {
									return parseInt(e.match(/(\d{3,4})/)[0]);
								} else {
									return null;
								}
							});

							quality.sort(sortNumberDesc);

							if (index !== undefined) {
								quality.splice(0, 0, '3D');
							}

							let allQuality = quality.map((result) => ({ val: result.toString(), selected: false }));
							res.json({ status: 'success', payload: allQuality });
						})
						.catch((err) => {
							if (err) {
								console.error(err);
								res.json({ status: 'error', content: err });
							}
						});
				}
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		return res.status(401).send('HTTP401 Unauthorized : Not logged.');
	}
});

// GET ALL QUALITY IN DB FOR FILTERS
router.post('/getSeasonsInCollection', (req, res) => {
	if (req.user) {
		Check.tokenExists(req.user.token)
			.then((response) => {
				if (response.status === 'error') {
					return res.status(401).send('HTTP401 Unauthorized : Bad API_TOKEN');
				} else {
					Videos.distinct(
						'season',
						req.body.title
							? { type: 'serie', title: { $regex: req.body.title, $options: 'i' } }
							: { type: 'serie' }
					)
						.then((resSeasons) => {
							if (resSeasons.length) {
								resSeasons.sort(sortNumberAsc);
								resSeasons = resSeasons.map((season, index) => {
									if (season > 0 && season < 100) {
										return season;
									} else {
										resSeasons.splice(index - 1, 1);
									}
								});

								let allSeasons = resSeasons.map((season) => {
									if (season !== undefined)
										return {
											val: season.toString(),
											selected: false
										};
								});
								res.json({ status: 'success', payload: allSeasons });
							} else {
								res.json({ status: 'success', payload: null });
							}
						})
						.catch((err) => {
							if (err) {
								console.error(err);
								res.json({ status: 'error', content: err });
							}
						});
				}
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		return res.status(401).send('HTTP401 Unauthorized : Not logged.');
	}
});

// GET MIN MAX IMDB NOTE IN DB FOR FILTERS
router.post('/getMinMaxImdbNote', (req, res) => {
	if (req.user) {
		Check.tokenExists(req.user.token)
			.then((response) => {
				if (response.status === 'error') {
					return res.status(401).send('HTTP401 Unauthorized : Bad API_TOKEN');
				} else {
					Videos.distinct(
						'rating',
						req.body.title ? { title: { $regex: req.body.title, $options: 'i' } } : {}
					)
						.then((rating) => {
							rating.sort(sortNumberAsc);

							if (rating[0] === -1) {
								rating.splice(0, 1);
							}

							res.json({
								status: 'success',
								payload: { min: Math.trunc(rating[0]), max: Math.trunc(rating[rating.length - 1]) }
							});
						})
						.catch((err) => {
							if (err) {
								console.error(err);
								res.json({ status: 'error', content: err });
							}
						});
				}
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		return res.status(401).send('HTTP401 Unauthorized : Not logged.');
	}
});

// GET MIN MAX YEARS IN DB FOR FILTERS
router.post('/getMinMaxYears', (req, res) => {
	if (req.user) {
		Check.tokenExists(req.user.token)
			.then((response) => {
				if (response.status === 'error') {
					return res.status(401).send('HTTP401 Unauthorized : Bad API_TOKEN');
				} else {
					Videos.distinct('year', req.body.title ? { title: { $regex: req.body.title, $options: 'i' } } : {})
						.then((year) => {
							year.sort(sortNumberAsc);
							if (year[0] === -1) {
								year.splice(0, 1);
							}

							res.json({
								status: 'success',
								payload: { min: year[0], max: year[year.length - 1] }
							});
						})
						.catch((err) => {
							if (err) {
								console.error(err);
								res.json({ status: 'error', content: err });
							}
						});
				}
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		return res.status(401).send('HTTP401 Unauthorized : Not logged.');
	}
});

// GET LIST  OF MOVIES / TV SHOW FROM DB BY NAME
router.get('/getmoviedetails/:movieID', (req, res) => {
	if (req.user) {
		Check.tokenExists(req.user.token)
			.then((response) => {
				if (response.status === 'error') {
					return res.status(401).send('HTTP401 Unauthorized : Bad API_TOKEN');
				} else {
					Videos.findOne({ _id: req.params.movieID }, (err, movie) => {
						if (movie) {
							res.json({ status: 'success', data: movie });
						} else {
							res.json({ status: 'error', data: [ { msg: 'An error occured.' } ] });
						}
					});
				}
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		return res.status(401).send('HTTP401 Unauthorized : Not logged.');
	}
});

module.exports = router;
