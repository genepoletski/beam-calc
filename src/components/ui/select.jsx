import React from 'react';

export default React.createClass({
  displayName: 'select',
  render: function () {
    var
      className, name, default_text,
      options = [],
      props = this.props;

    default_text = ' - deafault text - ';

    return (
      <select
        {className} ? className={className} : null
        >
        <option>{default_text}</option>
      </select>
    );
  }
});
