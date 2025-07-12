const ghpages = require('gh-pages');

ghpages.publish('build', {
  repo: 'https://github.com/jackie3668/celestial-tarot-2.0.git',
  branch: 'gh-pages',
  user: {
    name: 'jackie3668',
  
  }
}, (err) => {
  if (err) {
    console.error('🚨 Deploy failed:', err);
  } else {
    console.log('✅ Deploy successful!');
  }
});
