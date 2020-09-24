import React, { useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

const SubscriptionForm = ({ tags }) => {
  const [status, setStatus] = useState(null);
  const YOUR_FORM_ID = '1690057';
  const YOUR_SUBFORM_ID = '5615324';
  const YOUR_FORM_URL = `https://app.convertkit.com/forms/${YOUR_FORM_ID}/subscriptions`;

  //TODO: Cambiar Query a tomar solo las tags y no TODO dato valor que sea YAML.
  const data = useStaticQuery(graphql`
    query {
      allDataYaml {
        nodes {
          id
          name
        }
      }
    }
  `);

  const allTags = data.allDataYaml.nodes;
  const tagMap = allTags.reduce((result, tag) => {
    result[tag.name] = tag.id;
    return result;
  }, {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    try {
      const response = await fetch(YOUR_FORM_URL, {
        method: 'post',
        body: data,
        headers: {
          accept: 'application/json',
        },
      });

      const json = await response.json();

      if (json.status === 'success') {
        setStatus('SUCCESS');
        return;
      }

      setStatus('ERROR');
    } catch (err) {
      setStatus('ERROR');
    }
  };

  return (
    <form action={YOUR_FORM_URL} method='post' onSubmit={handleSubmit}>
      <input
        type='email'
        aria-label='Your email'
        name='email_address'
        placeholder='Your email address'
        required
      />
      {tags.map((tagName) => (
        <input
          key={tagMap[tagName]}
          id={`tag-${YOUR_SUBFORM_ID}-${tagMap[tagName]}`}
          type='checkbox'
          style={{ display: 'none' }}
          checked
          name='tags[]'
          value={tagMap[tagName]}
        />
      ))}
      <button type='submit'>Subscribe</button>
      {status === 'SUCCESS' && <p>Please go confirm your subscription!</p>}
      {status === 'ERROR' && <p>Oops, try again.</p>}
    </form>
  );
};

export default SubscriptionForm;
