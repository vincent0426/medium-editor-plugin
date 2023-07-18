import { Extension } from '@tiptap/core';
import { NodeSelection, TextSelection } from 'prosemirror-state';
import { keymap as prosemirrorKeymap } from 'prosemirror-keymap';

const EnterAfterImage = Extension.create({
  name: 'enterAfterImage',

  addProseMirrorPlugins() {
    return [
      prosemirrorKeymap({
        Enter: (state, dispatch) => {
          const { selection } = state;

          if (selection instanceof NodeSelection && selection.node.type.name === 'image') {
            if (dispatch) {
              // Insert the paragraph
              const transaction = state.tr.insert(selection.to, state.schema.nodes.paragraph.create());
              // Create a new selection that points to the position after the image
              const newSelection = TextSelection.create(transaction.doc, selection.to);

              // Apply the transaction with the new selection
              dispatch(transaction.setSelection(newSelection));
            }

            return true;
          }

          return false;
        }
      })
    ];
  }
});

export default EnterAfterImage;