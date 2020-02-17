import React from 'react'
import { Form, Input, List } from 'semantic-ui-react';
import ListActionItem from './ListActionItem';
import { Party } from '@daml/types';

type Props = {
  parties: Party[];
  onAddParty: (party: Party) => Promise<boolean>;
  onMessageParty: (party: Party) => void;
}

/**
 * React component to edit a list of `Party`s.
 */
const PartyListEdit: React.FC<Props> = ({parties, onAddParty, onMessageParty}) => {
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
        <ListActionItem
          key={party}
          icon='user outline'
          action={{
            icon: 'comment alternate',
            onClick: () => onMessageParty(party)
          }}
        >
          <List.Header>{party}</List.Header>
        </ListActionItem>
      )}
      <ListActionItem
        key='add friend'
        icon='user outline'
        action={{
          icon: 'add user',
          onClick: () => addParty(),
        }}
      >
        <Form onSubmit={addParty}>
          <Input
            fluid
            transparent
            readOnly={isSubmitting}
            loading={isSubmitting}
            size='small'
            placeholder='Add friend'
            value={newParty}
            onChange={(event) => setNewParty(event.currentTarget.value)}
          />
        </Form>
      </ListActionItem>
    </List>
  );
};

export default PartyListEdit;
