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

const cloneElement = (el, lastChild) => {
  if (!el) return [];
  if (!Array.isArray(lastChild)) lastChild = [lastChild];
  if (el.props && el.props.children) {
    return React.cloneElement(
      el,
      {},
      cloneElement(el.props.children, lastChild)
    );
  } else if (el.props) {
    return React.cloneElement(el, {}, [...lastChild]);
  } else {
    return [el, [...lastChild]];
  }
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
  let preTreeLen = 0;
  let nodes = [];
  let matches = text.matchAll(/<\s*(\/\s*)*([^>\s]*)[^><]*>/gi);
  matches = Array.from(matches);

  for (let match of matches) {
    let [substring, isClosing, tag] = match;
    let index = match['index'];
    tag = (tag || '').trim();
    isClosing = (isClosing || '').trim();
    substring = (substring || '').trim();
    if (!isClosing) {
      tags.push({ tag, substring, index });
    } else if (
      isClosing &&
      tags.length > 0 &&
      tag === tags[tags.length - 1].tag
    ) {
      let tagObj = tags.pop();
      const { substring, tag } = tagObj;
      let attr = substring.replace(/[<>]/gi, '').replace(tag, '');
      let props = extractPropsFromString(attr);
      let JsxEl = fn(tag, { ...props });

      JsxEl = cloneElement(
        JsxEl,
        text.slice(
          text.indexOf('>', tagObj.index) + 1,
          text.indexOf('<', tagObj.index + 1)
        )
      );

      nodes = [...nodes];

      if (preTreeLen <= tags.length) {
        nodes = [
          ...nodes,
          JsxEl,
          text.slice(
            text.indexOf('>', index) + 1,
            text.indexOf('<', index + 1) == -1
              ? Infinity
              : text.indexOf('<', index + 1)
          )
        ];
      } else {
        nodes = cloneElement(JsxEl, nodes);
      }
      preTreeLen = tags.length;
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
  return [
    text.slice(0, text.indexOf('<') == -1 ? Infinity : text.indexOf('<')),
    ...nodes
  ];
};

export default parseText;
