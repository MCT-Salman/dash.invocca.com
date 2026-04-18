const fs = require('fs');

const raw = fs.readFileSync('postman_deep_utf8.json', 'utf-8');
const json = JSON.parse(raw);

function traverse(item, path = '') {
  if (item.item) {
    item.item.forEach(sub => traverse(sub, path + '/' + item.name));
  } else if (item.request) {
    if (path.toLowerCase().includes('admin') || item.name.toLowerCase().includes('admin') || item.request.url?.raw?.includes('admin')) {
        console.log(`=== [${item.request.method}] ${item.name} ===`);
        console.log(`URL: ${item.request.url?.raw}`);
        
        if (item.request.body) {
            console.log(`BODY: ${item.request.body.mode}`);
            if (item.request.body.raw) {
                console.log(item.request.body.raw);
            }
            if (item.request.body.formdata) {
                console.log(JSON.stringify(item.request.body.formdata, null, 2));
            }
        }
        console.log('\n');
    }
  }
}

json.collection.item.forEach(i => traverse(i));
