const delay = milliseconds => new Promise(resolve => {
	setTimeout(resolve, milliseconds);
});

const download = async (url, name) => {
	const a = document.createElement('a');
	a.download = name;
	a.href = url;
	a.style.display = 'none';
	document.body.append(a);
	a.click();

	// Chrome requires the timeout
	await delay(100);
	a.remove();
};

const downloadAll = async (links) => {
  const urls = [];
  links.forEach(l => urls.push({ url: l.href, name: l.download }))

  for (let index = 0; index < urls.length; index++) {
		await delay(index * 300);
		download(urls[index].url, urls[index].name);
	}
}

export default downloadAll