class Settings {
	// this will store all the settings in this object
	// however, some settings will need to execute code on change, thus the getter/setter pairs
	raw = {
		// example value for dark mode setting
		darkMode: false
	};

	// example setter/getter for dark mode setting
	get darkMode() {
		return this.raw.darkMode;
	};
	set darkMode(value) {
		this.raw.darkMode = value;
		if (this.darkMode) {
			document.body.classList.add('dark');
		} else {
			document.body.classList.remove('dark');
		};
	};
};

class Network {
	online = Boolean();
	OfflineJS = Offline;
	#checkingConnection() {
		// this will be used later, to display the connection status on the taskbar.
	};
	constructor() {
		Offline.options = {
			checkOnLoad: true,
			interceptRequests: true,
			initialDelay: 10,
			requests: true
		};

		Offline.on('up', function () {
			window.SYSTEM.network.online = true;
		});
		Offline.on('down', function () {
			window.SYSTEM.network.online = false;
		});
		Offline.on('confirmed-up', function () {
			window.SYSTEM.network.online = true;
		});
		Offline.on('confirmed-down', function () {
			window.SYSTEM.network.online = false;
		});
		Offline.on('checking', function () {
			window.SYSTEM.network.#checkingConnection();
		});
	};
	/**
	 * @param {string} method
	 * @param {string|URL} url
	 * @param {XMLHttpRequestBodyInit} data
	 * @param {object} options
	 * @returns {Promise}
	 * @description
	 * Make an asynchronous web request.
	 */
	request(method, url, data, options) {
		return new Promise(function (resolve, reject) {
			const opts = { data: data };
			Object.assign(opts, options);

			const xhr = new XMLHttpRequest(opts);
			xhr.open(method, url);
			xhr.onload = function () {
				if (xhr.status >= 200 && xhr.status < 300) {
					resolve(xhr);
				} else {
					reject({
						status: xhr.status,
						statusText: xhr.statusText
					});
				};
			};
			xhr.onerror = function () {
				reject({
					status: xhr.status,
					statusText: xhr.statusText
				});
			};
			xhr.send(data);
		});
	};
	/**
	 * 
	 * @param {string} method
	 * @param {string|URL} url
	 * @param {XMLHttpRequestBodyInit} data
	 * @param {object} options
	 * @returns {XMLHttpRequest}
	 * @description
	 * Make a synchronous web request.
	 */
	requestSync(method, url, data, options) {
		const opts = { data: data };
		Object.assign(opts, options);

		const xhr = new XMLHttpRequest(opts);
		xhr.open(method, url, false);
		xhr.send(data);
		if (xhr.status >= 200 && xhr.status < 300) {
			return xhr;
		} else {
			throw new Error('Response error: ' + xhr.status + ' ' + xhr.statusText);
		};
	};
};

class System {
	navigator = window.navigator;
	settings = new Settings;
	network = new Network;
	audio = new AudioManager;
	path = Filer.path;
};