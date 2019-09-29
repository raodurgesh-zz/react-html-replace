# react-html-replace

A simple way to safely do html tag replacement with React components

## Install

```
$ npm install --save react-html-replace
```

## Usage

### Simple Example

```js
import React, { Component } from 'react';
import { render } from 'react-dom';

import reactHtmlReplace from 'react-html-replace';

const Mention = props => {
  const { children, id, name } = props;
  return (
    <span name={name} id={id} style={{ border: '1px solid #ccc' }}>
      &nbsp;{children}&nbsp;
    </span>
  );
};

class Demo extends Component {
  render() {
    return (
      <div>
        {reactHtmlReplace(
          `<italic>This is <bold> xml string</bold> with custom nexted markup,<bold> we can get inner markup & attribute  through props.</bold></italic> <mention id ="123" name ="raodurgesh">  this is mention tag with id & name attributes </mention> <hashtag tag="howdymody" href ="http://google.com"></hashtag>`,
          (tag, props) => {
            if (tag === 'bold') {
              return <b />;
            }
            if (tag === 'italic') {
              return <i />;
            }
            if (tag === 'mention') {
              const { name, id } = props;
              return <Mention name={name} id={id}></Mention>;
            }
            if (tag === 'hashtag') {
              const { tag, href } = props;
              return <a href={href}>{`#${tag}`}</a>;
            }
          }
        )}
      </div>
    );
  }
}

render(<Demo />, document.querySelector('#demo'));
```

### Output _(of above code)_

<i>This is <b> xml string</b> with custom nexted markup,<b> we can get inner markup &amp; attribute through props.</b></i> <span name="raodurgesh" id="123" style="border: 1px solid rgb(204, 204, 204);">&nbsp; this is mention tag with id &amp; name attribute this is mention tag with id &amp; name attribute &nbsp;</span> <a href="http://google.com">#howdymody</a>

## Params

`import reactHtmlReplace from 'react-html-replace';`

`reactHtmlReplace(xmlstring, callbackfunction);`

**xmlstring** : _the html string must have opening and closing tags._

**callbackfunction** :

- tag : _(html custom tag)_
- Props : \_Attributes of tag

i.e ,

**xmlstring** :`<bold> This is </bold><link href = "https://github.com">demo</link>`

**callbackfunction** : `(tag, props)`:

**tag** : `bold , link`

**props** : `href`

**children** : `In react component, we can have special React.Children as array`_(as show in Mention Component)_

## Getting started

```js
npm install
npm start
# go to localhost:3000 if it doesnt open automatically
```
