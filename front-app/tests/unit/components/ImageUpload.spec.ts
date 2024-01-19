import { mount } from "@vue/test-utils";
import ImageUpload from "@/components/ImageUpload.vue";

describe("ImageUpload", () => {
  it('should emit "fileUploaded" event WHEN a file is selected', async () => {
    const wrapper = mount(ImageUpload);

    const file = new File(["file content"], "example.jpg", {
      type: "image/jpeg",
    });

    const input = wrapper.find('input[type="file"]');

    Object.defineProperty(input.element, "files", {
      value: [file],
    });
    await input.trigger("change");

    expect(wrapper.emitted("fileUploaded")).toBeTruthy();
  });

  it('should not emit "fileUploaded" event WHEN no file is selected', async () => {
    const wrapper = mount(ImageUpload);

    const input = wrapper.find('input[type="file"]');
    await input.trigger("change");

    expect(wrapper.emitted("fileUploaded")).toBeFalsy();
  });
});
