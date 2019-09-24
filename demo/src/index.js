import React, { Component } from 'react';
import { render } from 'react-dom';

import parseText from '../../src';

const Mention = ({ children, id, name }) => {
  return (
    <span
      name={name}
      id={id}
      style={{ border: '1px solid #ccc', padding: '0 10px' }}
    >
      {children}
    </span>
  );
};

class Demo extends Component {
  render() {
    return (
      <div>
        {parseText(
          `<italic>This is <bold> xml string</bold> with custom nexted markup,<bold> we can get inner markup & attribute  through props.</bold></italic> <mention id ="123" name ="raodurgesh">  this is mention tag with id & name attribute </mention> `,
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
          }
        )}
      </div>
    );
  }
}

render(<Demo />, document.querySelector('#demo'));
