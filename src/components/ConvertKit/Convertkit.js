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
    <form
      action={YOUR_FORM_URL}
      method='post'
      onSubmit={handleSubmit}
      style={{
        backgroundColor: '#000000',
        color: '#ffffff',
        width: '90%',
        maxWidth: '650px',
        borderRadius: '1rem',
        margin: 'auto',
      }}
    >
      <div
        style={{
          backgroundColor: '#111111',
          paddingLeft: '8px',
          paddingRight: '8px',
          height: '50%',
        }}
      >
        <h2 style={{ paddingTop: '1rem' }}>Want more content like this?</h2>
        <p style={{ paddingBottom: '0rem' }}>
          I don't publish often, but when I do, you'll be the first to hear
          about it.
        </p>
      </div>
      <div style={{ backgroundColor: '#222222', padding: '1rem' }}>
        <input
          type='email'
          aria-label='Your email'
          name='email_address'
          placeholder=' Your email address'
          required
          style={{
            width: '90%',
            height: '3rem',
            paddingLeft: '1rem',
            borderRadius: '0.2rem',
            border: '0px',
            marginBottom: '1rem',
          }}
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
        <button
          type='submit'
          style={{
            backgroundColor: '#e89b27',
            color: '#ffffff',
            borderRadius: '3rem',
            border: '0px',
            fontSize: '1rem',
            fontWeight: 'bold',
            paddingTop: '1rem',
            paddingBottom: '1rem',
            width: '90%',
          }}
        >
          Get updates
        </button>
      </div>
      {status === 'SUCCESS' && <p>Please go confirm your subscription!</p>}
      {status === 'ERROR' && <p>Oops, try again.</p>}
    </form>
  );
};

export default SubscriptionForm;
