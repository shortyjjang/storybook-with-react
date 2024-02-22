import type { Meta, StoryObj } from '@storybook/react';
import Timepicker from '.';


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/TimePicker',
  component: Timepicker,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    className: { control: 'text' },
    currentHour: { control: { type: 'number', min:0, max:23 }
    , description: '0~23까지만 가능합니다.'},
    currentMinute: {
      control: 'radio', options: [0,1,2,3,4,5],
      description: '10분단위로 선택 0~5까지만 가능합니다.',
    },
    onChangeHour: { control: 'function' },
    onChangeMinutes: { control: 'function' },
    onHide: { control: 'function' },
  },
} satisfies Meta<typeof Timepicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Example: Story = {
  args: {
    className: '',
    currentHour: 1,
    currentMinute: 1,
    onChangeHour: (value: number) => {},
    onChangeMinutes: (value: number) => {},
    onHide: () => {},
  },
};
