function editorJsToHtml(obj) {
    if (!obj) {
        return;
    }
    const articleObj = {
        blocks: JSON.parse(obj.textContent)
    }
    // console.log(articleObj);
    let articleHTML = '';
    articleObj.blocks.map(obj => {
        switch (obj.type) {
            case 'paragraph':
                articleHTML += `<div class="ce-block">
          <div class="ce-block__content">
            <div class="ce-paragraph cdx-block">
              <p>${obj.data.text}</p>
            </div>
          </div>
        </div>\n`;
                break;
            case 'header':
                articleHTML += `<div class="ce-block">
          <div class="ce-block__content">
            <div class="ce-paragraph cdx-block">
              <h${obj.data.level}>${obj.data.text}</h${obj.data.level}>
            </div>
          </div>
        </div>\n`;
                break;
            case 'list':
                if (obj.data.style === 'unordered') {
                    const list = obj.data.items.map(item => {
                        return `<li class="cdx-list__item">${item}</li>`;
                    });
                    articleHTML += `<div class="ce-block">
            <div class="ce-block__content">
              <div class="ce-paragraph cdx-block">
                <ul class="cdx-list--unordered">${list.join('')}</ul>
              </div>
              </div>
            </div>\n`;
                } else {
                    const list = obj.data.items.map(item => {
                        return `<li class="cdx-list__item">${item}</li>`;
                    });
                    articleHTML += `<div class="ce-block">
            <div class="ce-block__content">
              <div class="ce-paragraph cdx-block">
                <ol class="cdx-list--ordered">${list.join('')}</ol>
              </div>
              </div>
            </div>\n`;
                }
                break;
            default:
                return '';
        }
    });

    // console.log(articleHTML);
    obj.innerHTML = articleHTML;

}
export default editorJsToHtml;