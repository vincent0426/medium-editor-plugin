import { InputRule } from '@tiptap/core';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import CharacterCount from '@tiptap/extension-character-count';
import Document from '@tiptap/extension-document';

import EnterAfterImage from './enter-after-image';
import UpdatedImage from './updated-image';

const contentLimit = 5000;

const contentDocument = Document.extend({
  content: 'block+'
});

export const Extensions = [
  StarterKit.configure({
    // config heading
    heading: {
      levels: [1, 2, 3]
    },
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc'
      }
    },
    orderedList: {
      HTMLAttributes: {
        class: 'list-decimal'
      } 
    },
    listItem: {
      HTMLAttributes: {
        class: 'leading-normal -mb-2'
      }
    },
    document: false
  }),
  contentDocument,
  HorizontalRule.extend({
    addInputRules() {
      return [
        new InputRule({
          find: /^(?:---|—-|___\s|\*\*\*\s)$/,
          handler: ({ state, range }) => {
            const attributes = {};

            const { tr } = state;
            const start = range.from;
            const end = range.to;

            tr.insert(start - 1, this.type.create(attributes)).delete(
              tr.mapping.map(start),
              tr.mapping.map(end),
            );
          }
        })
      ];
    }
  }).configure({
    HTMLAttributes: {
      class: 'mt-4 mb-6 border-t border-stone-300'
    }
  }),
  Placeholder.configure({
    placeholder: 'Tell your story...'
  }),
  Image.configure({
    allowBase64: true
  }),
  Link.configure({
    HTMLAttributes: {
      class: 'text-prime-500 underline'
    },
    validate: href => /^(https?:\/\/)/.test(href),
    openOnClick: true
  }),
  CharacterCount.configure({
    limit: contentLimit
  }),
  TextAlign.configure({
    types: ['image']
  }),
  UpdatedImage.configure({
    inline: true
  }),
  EnterAfterImage
];