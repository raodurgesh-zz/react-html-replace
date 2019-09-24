import React from 'react';

const extractPropsFromString = attr => {
  let propsStr = attr.match(/\s*([^=]*)\s*=\s*"([^"]*)"/gi) || [];
  return Object.assign(
    {},
    ...propsStr
      .map(s => {
        let arr = s.split('=');
        return {
          [(arr[0] || '').trim()]: (arr[1] || '').replace(/\s*["]+/g, '')
        };
      })
      .flat()
  );
};

/**
 * 
 * const fn = (tag, props) => {
    if (tag === 'mention') {
      return <MentionBlock />;
    }
    if (tag === 'bold') {
      return <b />;
    }
    if (tag === 'italic') {
      return <i />;
    }
  }
 */

const parseText = (text = '', fn = () => {}) => {
  let tags = [];
  let jsxElements = [];
  let prevIndex = -1;
  const matches = text.matchAll(/<\s*(\/\s*)*([^>\s]*)[^><]*>/gi);

  for (let match of matches) {
    let [substring, isClosing, tag] = match;
    let index = match['index'];
    tag = (tag || '').trim();
    isClosing = (isClosing || '').trim();
    substring = (substring || '').trim();
    if (!isClosing) {
      if (tags.length === 0) {
        if (index > prevIndex) {
          jsxElements.push(text.slice(prevIndex + 1, index));
        }
      }
      tags.push({ tag, substring, index });
    } else if (
      isClosing &&
      tags.length > 0 &&
      tag === tags[tags.length - 1].tag
    ) {
      let tagObj = tags.pop();
      if (tags.length === 0) {
        const { substring, tag } = tagObj;
        let attr = substring.replace(/[<>]/gi, '').replace(tag, '');
        let props = extractPropsFromString(attr);
        const innertext = text.slice(
          text.indexOf('>', tagObj.index) + 1,
          index
        );
        const JsxEl = fn(tag, { ...props, innertext });

        const cloneElement = el => {
          if (el.props && el.props.children) {
            return React.cloneElement(el, {}, cloneElement(el.props.children));
          } else if (el.props) {
            return React.cloneElement(el, {}, parseText(innertext, fn));
          } else {
            return [el, parseText(innertext, fn)];
          }
        };

        let el = null;
        if (JsxEl) {
          el = cloneElement(JsxEl);
        } else {
          el = `${substring} innertext </${tag}>`;
        }
        jsxElements.push(el);
        prevIndex = text.indexOf('>', index);
      }
    } else {
      throw Error('Invalid string, no matching tag "' + tag + '"');
    }
  }
  if (tags.length !== 0) {
    throw Error(
      'Invalid string, no matching tags : "' +
        (tags.map(t => t.tag) || '').toString() +
        '"'
    );
  }
  if (text.length - 1 > prevIndex) {
    jsxElements.push(text.slice(prevIndex + 1));
  }
  return jsxElements;
};

export default parseText;
