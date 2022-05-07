import { titles } from '../title.config';
const componentsContext = require.context('./', true, /.ts$/);

const maps: string[] = [];

componentsContext.keys().forEach((filePath: string) => {
    // 获取文件中的 default 模块
    const filename = filePath.replace(/.\/(\w+)(\.html|\.ts)$/, (rs, $1) => $1);

    if (filename !== 'index') {
        maps.push(filename);
    }
});

document.body.innerHTML = `
        <ul>
            ${maps
                .map(
                    (filename) =>
                        `<li><a href="${'./' + filename + '.html'}">
                        ${filename + ' ' + (titles[filename] || '')}
                        </a></li>`
                )
                .join('')}
        </ui>
    `;
