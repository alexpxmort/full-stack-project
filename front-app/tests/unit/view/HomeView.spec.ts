import { VueWrapper, mount } from "@vue/test-utils";
import HomeView from "@/views/HomeView.vue";

jest.mock("vue-chart-3", () => ({
  BarChart: () => null,
  useBarChart: jest.fn().mockReturnValue({
    barChartProps: {},
    barChartRef: {},
  }),
}));
describe("HomeView.vue", () => {
  let wrapper: VueWrapper<any>;

  beforeAll(() => {
    globalThis.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            monthRateRevenue: {},
            churnRate: {},
          }),
      })
    ) as any;
  });

  beforeEach(() => {
    wrapper = mount(HomeView);
  });

  it("should render the component", () => {
    expect(wrapper.exists()).toBe(true);
  });
  it("should handle file upload and fetch data", async () => {
    const file = new File(["file content"], "example.csv", {
      type: "text/csv",
    });

    await wrapper
      .findComponent({ name: "ImageUpload" })
      .vm.$emit("fileUploaded", file);

    await wrapper.findComponent({ name: "StyledButton" }).trigger("click");

    expect(wrapper.findComponent({ name: "CustomLoader" }).exists()).toBe(true);
  });

  it("should show a warning WHEN no file is selected", async () => {
    await wrapper.findComponent({ name: "StyledButton" }).trigger("click");

    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent({ name: "CustomAlert" }).exists()).toBe(true);
  });
});
