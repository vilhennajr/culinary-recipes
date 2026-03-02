import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import BaseAlert from "@/components/atoms/BaseAlert.vue";

describe("BaseAlert", () => {
  it("renders the message", () => {
    const wrapper = mount(BaseAlert, { props: { message: "Erro encontrado" } });
    expect(wrapper.text()).toContain("Erro encontrado");
  });

  it("applies error styles when type=error", () => {
    const wrapper = mount(BaseAlert, { props: { message: "Ops!", type: "error" } });
    expect(wrapper.get("div").classes()).toContain("bg-red-50");
  });

  it("applies success styles when type=success", () => {
    const wrapper = mount(BaseAlert, { props: { message: "Ok!", type: "success" } });
    expect(wrapper.get("div").classes()).toContain("bg-green-50");
  });

  it("applies warning styles when type=warning", () => {
    const wrapper = mount(BaseAlert, { props: { message: "Aten\u00e7\u00e3o!", type: "warning" } });
    expect(wrapper.get("div").classes()).toContain("bg-yellow-50");
  });

  it("applies info styles by default (no type prop)", () => {
    const wrapper = mount(BaseAlert, { props: { message: "Info" } });
    expect(wrapper.get("div").classes()).toContain("bg-blue-50");
  });

  it("does not show dismiss button by default", () => {
    const wrapper = mount(BaseAlert, { props: { message: "Info" } });
    expect(wrapper.find("button").exists()).toBe(false);
  });

  it("shows dismiss button when dismissible=true", () => {
    const wrapper = mount(BaseAlert, { props: { message: "Info", dismissible: true } });
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("emits dismiss when button is clicked", async () => {
    const wrapper = mount(BaseAlert, { props: { message: "Info", dismissible: true } });
    await wrapper.get("button").trigger("click");
    expect(wrapper.emitted("dismiss")).toBeTruthy();
    expect(wrapper.emitted("dismiss")?.length).toBe(1);
  });
});
