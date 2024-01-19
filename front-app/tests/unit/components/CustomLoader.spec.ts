import { mount, VueWrapper } from "@vue/test-utils";
import CustomLoader from "@/components/CustomLoader.vue";

describe("CustomLoader", () => {
  let wrapper: VueWrapper<any>;

  it("should renders  loader WHEN isLoading is true", async () => {
    wrapper = mount(CustomLoader, {
      props: {
        isLoading: true,
      },
    });

    expect(wrapper.find(".loader-container").exists()).toBe(true);

    expect(wrapper.text()).toContain("Carregando dados ...");
  });

  it("should not render loader WHEN isLoading is false", async () => {
    wrapper = mount(CustomLoader, {
      props: {
        isLoading: false,
      },
    });

    expect(wrapper.find(".loader-container").exists()).toBe(false);
  });
});
