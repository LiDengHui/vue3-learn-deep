// @ts-expect-error
const componentsContext = require.context('./', true, /.ts$/);
const maps = [];

componentsContext.keys().forEach((filePath) => {
    // 获取文件中的 default 模块
    const filename = filePath.replace(
        /.\/(\w+)(\.html|\.ts)$/,
        (rs, $1, $2) => $1
    );

    if (filename !== 'index') {
        maps.push(filename);
    }
});

const titles = {
};
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
