// YourComponent.stories.ts|tsx
import Editor from '../src';

//👇 This default export determines where your story goes in the story list
const meta = {
  component: Editor,
};

export default meta;

export const FirstStory = {
  args: {
    //👇 The args you need here will depend on your component
  },
};