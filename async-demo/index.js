console.log('Before');
// getUser(1, (user) => {
//     getRepos(user.githubUsername, (repos) => {
//         getCommits(repos[0], (commits) => {
//             console.log(commits);
//         })
//     })
// });

getUser(1)
    .then(user => getRepos(user.githubUsername))
    .then(repos => getCommits(repos[0]))
    .then(commits => console.log(commits))
    .catch(err => console.log('Error', err.message));

console.log('After');

function getUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
        console.log('Getting user from the database...');
        resolve({ id: id, githubUsername: 'spidey' });
    }, 2000);
    })
}

function getRepos(username) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
        console.log('Getting the repos');
        resolve(['repo1', 'repo2', 'repo3']);
    }, 2000);
    })
}

function getCommits(repo) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
        console.log('getting commits');
        resolve(['commit1', 'commit2']);
    }, 2000);
    })
}