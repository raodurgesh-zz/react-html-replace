import React, { Component } from 'react';
import { render } from 'react-dom';

import reactHtmlReplace from '../../src';

const Mention = ({ children, id, name }) => {
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
          `<italic>This is <bold> xml string</bold> with custom nexted markup,<bold> we can get inner markup & attribute  through props.</bold></italic> <mention id ="123" name ="raodurgesh">  this is mention tag with id & name attribute </mention> <hashtag tag="howdymody" href ="http://google.com"></hashtag>`,
          (tag, props) => {
            if (tag === 'bold') {
              return <b />;
            }
            if (tag === 'italic') {
              return <i />;
            }
            if (tag === 'mention') {
              const { name, id, innertext } = props;
              return (
                <Mention name={name} id={id}>
                  {innertext}
                </Mention>
              );
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
