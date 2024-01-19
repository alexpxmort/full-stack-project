import { mount, VueWrapper } from "@vue/test-utils";
import CustomAlert from "@/components/CustomAlert.vue";

describe("CustomAlert", () => {
  let wrapper: VueWrapper<any>;

  it('should renders alert with default "warn" type WHEN type is not provided', () => {
    wrapper = mount(CustomAlert, {
      props: {
        message: "Test Message",
      },
    });

    expect(wrapper.find(".custom-alert").exists()).toBe(true);
    expect(wrapper.classes()).toContain("warn");
    expect(wrapper.text()).toContain("Test Message");
  });

  it("should renders alert with specified type", () => {
    wrapper = mount(CustomAlert, {
      props: {
        message: "Test Message",
        type: "success",
      },
    });

    expect(wrapper.find(".custom-alert").exists()).toBe(true);
    expect(wrapper.classes()).toContain("success");
    expect(wrapper.text()).toContain("Test Message");
  });
});
