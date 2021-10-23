(async () => {
	const dom = {
		select: document.querySelector.bind(document),
		selectAll: document.querySelectorAll.bind(document)
	};

	const username = 'Beniio';
	const email = 'beniamin.gadecki@gmail.com';

	const response = await fetch(`https://api.github.com/users/${username}/events/public`);
	const json = await response.json();
  console.log(response)
	let latestCommit;
	const latestPushEvent = json.find(event => {
		if (event.type !== 'PushEvent') {
			return false;
		}

		latestCommit = event.payload.commits.reverse().find(commit => commit.author.email === email);
		return Boolean(latestCommit);
	});

	if (!latestCommit) {
		dom.select('#latest-commit').textContent = 'No commit';
		return;
	}

	const {repo, created_at: createdAt} = latestPushEvent;
	const repoUrl = `https://github.com/${repo.name}`;

	const commitTitleElement = dom.select('#latest-commit .commit-title');
	commitTitleElement.href = `${repoUrl}/commit/${latestCommit.sha}`;
	const commitMessageLines = latestCommit.message.trim().split('\n');
	commitTitleElement.title = commitMessageLines.slice(1).join('\n').trim();
	commitTitleElement.textContent = commitMessageLines[0].trim();

	const commitDateElement = dom.select('#latest-commit .commit-date');
  commitDateElement.textContent = timeago.format(createdAt);

	const repoTitleElement = dom.select('#latest-commit .repo-title');
	repoTitleElement.href = repoUrl;
	repoTitleElement.textContent = repo.name.replace(new RegExp(`^${username}/`), '');
})();