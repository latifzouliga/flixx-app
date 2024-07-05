const global = {
	currentPage: window.location.pathname,
	search: {
		term: '',
		type: '',
		page: 1,
		totalPages: 0,
		totalResults: 0,
		currentNumOfpages: 0,
	},
	api: {
		apiKey: '7d794a5505076eebb5625c774b98a13c',
		apiUrl: 'https://api.themoviedb.org/3/',
	},
};


// Display popular movies
async function displayPopularMovies() {
	const { results } = await fetchAPIData('movie/popular');

	results.forEach(({ id, title, poster_path, release_date }) => {
		const div = createDiv('card');

		const a = createLink(`movie-details.html?id=${id}`);

		const img = createImg(
			'card-img-top',
			'https://image.tmdb.org/t/p/w500' + poster_path,
			name
		);
		a.appendChild(img);

		const innerDiv = createDiv('card-body');
		const h5 = createH('h5', 'card-title', title);
		const p = createP('card-text');
		const small = createSmall(
			'text-muted',
			`Release Date: ${release_date}`
		);

		p.appendChild(small);

		innerDiv.appendChild(h5);
		innerDiv.appendChild(p);

		div.appendChild(a);
		div.appendChild(innerDiv);

		document.querySelector('#popular-movies').appendChild(div);
	});
}


//display 20 most popular tv shows
async function displayTVShows() {
	const { results } = await fetchAPIData('tv/popular');

	results.forEach(({ id, name, poster_path, first_air_date }) => {
		const div = createDiv('card');

		const a = createLink(`tv-details.html?id=${id}`);

		const img = createImg(
			'card-img-top',
			'https://image.tmdb.org/t/p/w500' + poster_path,
			name
		);
		a.appendChild(img);

		const innerDiv = createDiv('card-body');
		const h5 = createH('h5', 'card-title', name);
		const p = createP('card-text');
		const small = createSmall(
			'text-muted',
			`First Air Date: ${first_air_date}`
		);

		p.appendChild(small);

		innerDiv.appendChild(h5);
		innerDiv.appendChild(p);

		div.appendChild(a);
		div.appendChild(innerDiv);

		document.querySelector('#popular-shows').appendChild(div);
	});
}

// display Movie detailes
async function displayMovieDetails() {
	const movieId = window.location.search.split('=')[1];
	const {
		backdrop_path,
		poster_path,
		title,
		vote_average,
		release_date,
		overview,
		homepage,
		production_companies,
		budget,
		revenue,
		status,
		runtime,
		genres,
	} = await fetchAPIData(`movie/${movieId}`);

	// Overlay for background image
	displayBackgroundImage('movie', backdrop_path);

	const topDiv = () => {
		const div = createDiv('details-top');
		const innerDiv1 = createDiv();
		const image = createImg(
			'card-img-top',
			poster_path
				? 'https://image.tmdb.org/t/p/w500' + poster_path
				: 'images/no-image.jpg',
			title
		);

		innerDiv1.appendChild(image);
		div.appendChild(innerDiv1);

		const innerDiv2 = createDiv();
		const h2 = createH('h2', '', title);

		const p1 = createP();
		const rating = document.createTextNode(
			` ${vote_average.toFixed(1)} / 10`
		);
		const icon = createIcon('fas fa-star text-primary');

		p1.appendChild(icon);
		p1.appendChild(rating);

		const p2 = createP('text-muted', `Release Date: ${release_date}`);
		const p3 = createP('', overview);
		const h5 = createH('h5', '', 'Genres');

		const ul = createUl('list-group', '');
		genres.forEach((genre) => {
			const li = document.createElement('li');
			li.textContent = genre.name;
			ul.appendChild(li);
		});

		const a = createLink(homepage, '_blank', 'btn', 'Visit Movie Homepage');

		innerDiv2.appendChild(h2);
		innerDiv2.appendChild(p1);
		innerDiv2.appendChild(p2);
		innerDiv2.appendChild(p3);
		innerDiv2.appendChild(h5);
		innerDiv2.appendChild(ul);
		innerDiv2.appendChild(a);
		div.appendChild(innerDiv2);
		return div;
	};

	const bottomDiv = () => {
		const div = createDiv('details-bottom');
		const h2 = createH('h2', '', 'Movie Info');

		const movieInfo = {
			Budget: `${budget.toLocaleString()}`,
			Revenue: `${revenue.toLocaleString()}`,
			Runtime: `${runtime} minutes`,
			Status: status,
		};

		const ul = createUl('', '');
		for (const key in movieInfo) {
			const li = document.createElement('li');
			const span = createSpan('text-secondary', `${key}: `);
			li.appendChild(span);
			const text = document.createTextNode(movieInfo[key]);
			li.appendChild(text);
			ul.appendChild(li);
		}

		const h4 = createH('h4', '', 'Production Companies');
		const div2 = createDiv('list-group');
		div2.textContent = production_companies.map((c) => c.name).join(', ');

		div.appendChild(h2);
		div.appendChild(ul);
		div.appendChild(h4);
		div.appendChild(div2);
		return div;
	};

    const div = document.getElementById('movie-details');
	div.appendChild(topDiv());
	div.appendChild(bottomDiv());
}

// display TV show detailes
async function displayTvShowDetails() {
	const tvShowId = window.location.search.split('=')[1];
	const tvShow = await fetchAPIData(`tv/${tvShowId}`);
	
	// Overlay for background image
	displayBackgroundImage('tv', tvShow.backdrop_path);

	const topDiv = () => {
		const div1 = createDiv('details-top');
		const innerDiv1 = createDiv();
		const image = createImg(
			'card-img-top',
			show.poster_path
				? 'https://image.tmdb.org/t/p/w500' + show.poster_path
				: 'images/no-image.jpg',
			show.name
		);

		innerDiv1.appendChild(image);
		div1.appendChild(innerDiv1);

		const innerDiv2 = createDiv();
		const h2 = createH('h2', '', show.name);

		const p1 = createP();

		const icon = createIcon(
			'fas fa-star text-primary',
			` ${show.vote_average.toFixed(1)} / 10`
		);

		p1.appendChild(icon);

		const p2 = createP(
			'text-muted',
			`Release Date: ${show.first_air_date}`
		);
		const p3 = createP('', show.overview);
		const h5 = createH('h5', '', 'Genres');

		const ul = createUl('list-group');
		show.genres.forEach((genre) => {
			const li = document.createElement('li');
			const text = document.createTextNode(genre.name);
			li.appendChild(text);
			ul.appendChild(li);
		});

		const a = createLink(
			show.homepage,
			'_blank',
			'btn',
			'Visit show Homepage'
		);

		innerDiv2.appendChild(h2);
		innerDiv2.appendChild(p1);
		innerDiv2.appendChild(p2);
		innerDiv2.appendChild(p3);
		innerDiv2.appendChild(h5);
		innerDiv2.appendChild(ul);
		innerDiv2.appendChild(a);
		div1.appendChild(innerDiv2);
		return div1;
	};

	const bottomDiv = () => {
		const div = createDiv('details-bottom');
		const h2 = createH('h2', '', 'show Info');

		const showInfo = {
			['Number Of Episodes']: `${show.number_of_episodes}`,
			['Last Episode To Air']: `${show.last_episode_to_air.name}`,
			Status: show.status,
		};

		const ul = createUl('', '');
		for (const key in showInfo) {
			const li = document.createElement('li');
			const span = createSpan('text-secondary', `${key}: `);
			li.appendChild(span);
			const text = document.createTextNode(showInfo[key]);
			li.appendChild(text);
			ul.appendChild(li);
		}

		const h4 = createH('h4', '', 'Production Companies');
		const div2 = createDiv('list-group');
		div2.textContent = show.production_companies
			.map((company) => company.name)
			.join(', ');

		div.appendChild(h2);
		div.appendChild(ul);
		div.appendChild(h4);
		div.appendChild(div2);
		return div;
	};

    const div = document.getElementById('show-details');
	div.appendChild(topDiv());
	div.appendChild(bottomDiv());
}

// Display backdrop On Details page
function displayBackgroundImage(type, backgroundPath) {
	const overlayDiv = document.createElement('div');
	overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;

	overlayDiv.classList.add('background-image');
	if (type === 'movie') {
		document.querySelector('#movie-details').appendChild(overlayDiv);
	} else {
		document.querySelector('#show-details').appendChild(overlayDiv);
	}
}

function showDetailsBottom(show) {
	const div = createDiv('details-bottom');
	const h2 = createH('h2', '', 'show Info');

	const showInfo = {
		['Number Of Episodes']: `${show.number_of_episodes}`,
		['Last Episode To Air']: `${show.last_episode_to_air.name}`,
		Status: show.status,
	};

	const ul = createUl('', '');
	for (const key in showInfo) {
		const li = document.createElement('li');
		const span = createSpan('text-secondary', `${key}: `);
		li.appendChild(span);
		const text = document.createTextNode(showInfo[key]);
		li.appendChild(text);
		ul.appendChild(li);
	}

	const h4 = createH('h4', '', 'Production Companies');
	const div2 = createDiv('list-group');
	div2.textContent = show.production_companies
		.map((company) => company.name)
		.join(', ');

	div.appendChild(h2);
	div.appendChild(ul);
	div.appendChild(h4);
	div.appendChild(div2);
	return div;
}

// Search Movies/Shows
async function search() {
	// get data from url
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	global.search.type = urlParams.get('type');
	global.search.term = urlParams.get('search-term');

	if (global.search.term != '' && global.search.term != null) {
		const { results, total_pages, page, total_results } =
			await searchAPIData();

		global.search.page = page;
		global.search.totalPages = total_pages;
		global.search.totalResults = total_results;
		global.search.currentNumOfpages = results.length;

		if (results.length === 0) {
			showAlert('No results found');
			return;
		}
		displaySearchResults(results);
		document.querySelector('#search-term').value = '';
	} else {
		showAlert('Please Enter search term');
	}
}

// Display search results on DOM
function displaySearchResults(results) {
	const searchResulDiv = document.querySelector('#search-results');
	searchResulDiv.innerHTML = '';

	results.forEach((result) => {
		if (result.poster_path) {
			let title = '';
			let releaseDate = '';
			if (global.search.type === 'movie') {
				title = result.title;
				releaseDate = 'Release: ' + result.release_date;
			} else {
				title = result.name;
				releaseDate = 'first On Air:' + result.first_air_date;
			}

			const cardDiv = createDiv('card');
			const a = createLink(
				`${global.search.type}-details.html?id=${result.id}`
			);
			const img = createImg(
				'card-img-top',
				'https://image.tmdb.org/t/p/w500' + result.poster_path,
				''
			);
			const cardBodyDiv = createDiv('card-body');

			const h5 = createH('h5', 'card-title', title);
			const p = createP('card-text');
			const small = createSmall('text-muted', releaseDate);

			a.appendChild(img);
			p.appendChild(small);
			cardBodyDiv.appendChild(h5);
			cardBodyDiv.appendChild(p);
			cardDiv.appendChild(a);
			cardDiv.appendChild(cardBodyDiv);

			searchResulDiv.appendChild(cardDiv);
		}
	});

	const { currentNumOfpages, totalResults, term } = global.search;
	const searchResultHeading = `${currentNumOfpages} of ${totalResults} Results for ${term}`;

	const h2 = createH('h2', '', searchResultHeading);
	const headingDiv = document.querySelector('#search-results-heading');
	headingDiv.innerHTML = '';
	headingDiv.appendChild(h2);
	displayPagination();
}

// Create display pagination for search
function displayPagination() {
	const div = createDiv('pagination');

	const nextBtn = document.createElement('button');
	nextBtn.classList.add('btn', 'btn-primary');
	nextBtn.setAttribute('id', 'next');
	nextBtn.textContent = 'Next';

	const prevBtn = document.createElement('button');
	prevBtn.classList.add('btn', 'btn-primary');
	prevBtn.setAttribute('id', 'prev');
	prevBtn.textContent = 'Prev';

	const pageCounterDiv = createDiv('page-counter');
	pageCounterDiv.textContent = `Page ${global.search.page} / ${global.search.totalPages}`;

	div.appendChild(prevBtn);
	div.appendChild(nextBtn);
	div.appendChild(pageCounterDiv);

	const paginationDiv = document.querySelector('#pagination');
	paginationDiv.appendChild(div);

	// disable prev button if in first page
	if (global.search.page === 1) {
		document.querySelector('#prev').disabled = true;
	}

	// disable the next button if in last page
	if (global.search.page === global.search.totalPages) {
		document.querySelector('#next').disabled = true;
	}

	// Next page
	document.querySelector('#next').addEventListener('click', async () => {
		global.search.page++;

		const { results, total_pages } = await searchAPIData();
		global.search.currentNumOfpages += results.length;
		paginationDiv.innerHTML = '';
		displaySearchResults(results);
	});

	// Previous page
	document.querySelector('#prev').addEventListener('click', async () => {
		global.search.page--;
		const { results, total_pages } = await searchAPIData();
		global.search.currentNumOfpages -= results.length;
		displaySearchResults(results);
	});
}

//Display Slider Movies
async function displaySlider() {
	const { results } = await fetchAPIData('movie/now_playing');

	results.forEach((movie) => {
		const div = createDiv('swiper-slide');
		const link = createLink(`movie-details.html?id=${movie.id}`);
		const img = createImg(
			'',
			'https://image.tmdb.org/t/p/w500' + movie.poster_path,
			movie.title
		);
		const h4 = createH('h4', 'swiper-rating', '');
		const icon = createIcon('fas fa-star text-secondary');

		const rating = document.createTextNode(
			` ${movie.vote_average.toFixed(1)} / 10`
		);

		link.appendChild(img);
		h4.appendChild(icon);
		h4.appendChild(rating);
		div.appendChild(link);
		div.appendChild(h4);

		document.querySelector('.swiper-wrapper').appendChild(div);

		initSwiper();
	});
}

function initSwiper() {
	const swiper = new Swiper('.swiper', {
		slidesPerView: 1,
		spaceBetween: 30,
		freeMode: true,
		loop: true,
		autoplay: {
			delay: 4000,
			disableOnInteraction: false,
		},
		breakpoints: {
			500: {
				slidesPerView: 2,
			},
			700: {
				slidesPerView: 3,
			},
			1200: {
				slidesPerView: 4,
			},
		},
	});
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
	const API_KEY = global.api.apiKey;
	const API_URL = global.api.apiUrl;

	showSpinner();
	const reponse = await fetch(
		`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
	);

	const data = await reponse.json();
	hideSpinner();

	return data;
}

// make request to search
async function searchAPIData() {
	const API_KEY = global.api.apiKey;
	const API_URL = global.api.apiUrl;
	const SEARCH_TYPE = global.search.type;
	const SEARCH_TERM = global.search.term;
	const PAGE_NUMBER = global.search.page;

	showSpinner();

	const reponse = await fetch(
		`${API_URL}search/${SEARCH_TYPE}?api_key=${API_KEY}&language=en-US&query=${SEARCH_TERM}&page=${PAGE_NUMBER}`
	);

	const data = await reponse.json();
	hideSpinner();

	return data;
}

// Highlight active link
function highlightActiveLink(e) {
	const links = document.querySelectorAll('.nav-link');
	links.forEach((link) => {
		if (link.getAttribute('href') === global.currentPage) {
			link.classList.add('active');
		}
	});
}

function showAlert(message, className = 'alert-error') {
	const alertEl = document.createElement('div');
	alertEl.classList.add('alert', className);
	alertEl.innerText = message;

	const alertDiv = document.getElementById('alert');
	alertDiv.appendChild(alertEl);
	alertEl.style.opacity = 1;

	const fadeOut = () => {
		const fadeInterval = setInterval(() => {
			alertEl.style.opacity -= 0.05;

			if (alertEl.style.opacity <= 0) {
				clearInterval(fadeInterval);
				alertEl.remove();
			}
		}, 40);
	};

	setTimeout(fadeOut, 2000);
}

function showSpinner() {
	document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
	document.querySelector('.spinner').classList.remove('show');
}

function createUl(classes = '', text = '') {
	const ul = document.createElement('ul');
	ul.className = classes;
	ul.innerText = text;
	return ul;
}

function createSpan(classes = '', text = '') {
	const span = document.createElement('span');
	span.className = classes;
	span.innerText = text;
	return span;
}

function createIcon(classes = '', text = '') {
	const icon = document.createElement('i');
	icon.className = classes;
	icon.innerText = text;
	return icon;
}

function createDiv(classes = '') {
	const div = document.createElement('div');
	div.className = classes;
	return div;
}

function createLink(href = '', target = '', classes = '', text = '') {
	const a = document.createElement('a');
	a.setAttribute('href', href);
	a.setAttribute('target', target);
	a.className = classes;
	a.textContent = text;
	return a;
}

function createImg(classes = '', src = '', alt = '') {
	const img = document.createElement('img');
	img.className = classes;
	img.setAttribute('src', src);
	img.setAttribute('alt', alt);
	return img;
}

function createH(hTag = '', classes = '', text = '') {
	const tag = document.createElement(hTag);
	tag.className = classes;
	tag.textContent = text;
	return tag;
}

function createP(classes = '', text = '') {
	const p = document.createElement('p');
	p.className = classes;
	p.textContent = text;
	return p;
}

function createSmall(classes = '', text = '') {
	const small = document.createElement('small');
	small.className = classes;
	small.textContent = text;
	return small;
}

// Init App
function init() {
	switch (global.currentPage) {
		case '/':
		case '/index.html':
			displayPopularMovies();
			displaySlider();
			break;
		case '/shows.html':
			displayTVShows();
			break;
		case '/movie-details.html':
			displayMovieDetails();
			break;
		case '/tv-details.html':
			displayTvShowDetails();
			break;
		case '/search.html':
			search();
			break;
	}

	highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
