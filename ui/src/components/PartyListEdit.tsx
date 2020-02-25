import React from 'react'
import { Form, List, Button } from 'semantic-ui-react';
import { Party } from '@daml/types';

type Props = {
  parties: Party[];
  onAddParty: (party: Party) => Promise<boolean>;
}

/**
 * React component to edit a list of `Party`s.
 */
const PartyListEdit: React.FC<Props> = ({parties, onAddParty}) => {
  const [newParty, setNewParty] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const addParty = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    setIsSubmitting(true);
    const success = await onAddParty(newParty);
    setIsSubmitting(false);
    if (success) {
      setNewParty('');
    }
  }

  return (
    <List relaxed>
      {[...parties].sort((x, y) => x.localeCompare(y)).map((party) =>
        <List.Item
          key={party}
        >
          <List.Icon name='user outline' />
          <List.Content>
            <List.Header>{party}</List.Header>
          </List.Content>
        </List.Item>
      )}
      <br />
      <Form onSubmit={addParty}>
        <Form.Input
          fluid
          readOnly={isSubmitting}
          loading={isSubmitting}
          placeholder="Friend's name"
          value={newParty}
          onChange={(event) => setNewParty(event.currentTarget.value)}
        />
        <Button type='submit'>Add Friend</Button>
      </Form>
    </List>
  );
};

export default PartyListEdit;
