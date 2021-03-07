import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import Button from "./Button";
import ButtonProps from "./ButtonProps";

export default {
  title: "Example/Button",
  component: Button,
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
};

export const NotPrimary = Template.bind({});
NotPrimary.args = {
  primary: false,
};
