import { mount, VueWrapper } from "@vue/test-utils";
import StyledButton from "@/components/StyledButon.vue";

describe("StyledButton", () => {
  let wrapper: VueWrapper<any>;

  it("should render button with default text and call onClick  WHEN was clicked", async () => {
    const onClickMock = jest.fn();
    wrapper = mount(StyledButton, {
      props: {
        onClick: onClickMock,
      },
    });

    await wrapper.trigger("click");

    expect(onClickMock).toHaveBeenCalled();

    expect(wrapper.text()).toContain("Click me");
  });

  it("should render button with custom text", () => {
    wrapper = mount(StyledButton, {
      props: {
        buttonText: "Custom Text",
      },
    });

    expect(wrapper.text()).toContain("Custom Text");
  });
});
