const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
    let results = [];
    fs.readdir(dir, (err, list) => {
        if (err) return done(err);
        let pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(file => {
            file = path.resolve(dir, file);
            fs.stat(file, (err, stat) => {
                if (stat && stat.isDirectory()) {
                    walk(file, (err, res) => {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};

const srcDir = 'c:/Users/sadaf/OneDrive/Desktop/ornamis-2/src';

walk(srcDir, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        if (!file.endsWith('.ts') && !file.endsWith('.tsx') && !file.endsWith('.js')) return;

        let content = fs.readFileSync(file, 'utf8');
        const regex = /(['"])(\/jewelry\/[^'"]*?)\1/g;

        let changed = false;
        const newContent = content.replace(regex, (match, quote, p) => {
            if (p.includes(' ')) {
                console.log(`Fixing space in ${file}: ${p}`);
                changed = true;
                return `${quote}${p.replace(/ /g, '_')}${quote}`;
            }
            return match;
        });

        if (changed) {
            fs.writeFileSync(file, newContent);
        }
    });
});
