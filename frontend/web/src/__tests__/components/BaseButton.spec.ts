import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import BaseButton from "@/components/atoms/BaseButton.vue";

describe("BaseButton", () => {
  it("renders slot content", () => {
    const wrapper = mount(BaseButton, { slots: { default: "Salvar" } });
    expect(wrapper.text()).toContain("Salvar");
  });

  it("has type=button by default", () => {
    const wrapper = mount(BaseButton);
    expect(wrapper.get("button").attributes("type")).toBe("button");
  });

  it("accepts type=submit", () => {
    const wrapper = mount(BaseButton, { props: { type: "submit" } });
    expect(wrapper.get("button").attributes("type")).toBe("submit");
  });

  it("applies primary variant classes by default", () => {
    const wrapper = mount(BaseButton);
    expect(wrapper.get("button").classes()).toContain("bg-primary-600");
  });

  it("applies danger variant classes", () => {
    const wrapper = mount(BaseButton, { props: { variant: "danger" } });
    expect(wrapper.get("button").classes()).toContain("bg-red-600");
  });

  it("applies secondary variant classes", () => {
    const wrapper = mount(BaseButton, { props: { variant: "secondary" } });
    expect(wrapper.get("button").classes()).toContain("border-gray-300");
  });

  it("applies ghost variant classes", () => {
    const wrapper = mount(BaseButton, { props: { variant: "ghost" } });
    expect(wrapper.get("button").classes()).toContain("text-gray-600");
  });

  it("applies sm size classes", () => {
    const wrapper = mount(BaseButton, { props: { size: "sm" } });
    expect(wrapper.get("button").classes()).toContain("px-3");
  });

  it("applies lg size classes", () => {
    const wrapper = mount(BaseButton, { props: { size: "lg" } });
    expect(wrapper.get("button").classes()).toContain("px-6");
  });

  it("shows spinner when loading=true", () => {
    const wrapper = mount(BaseButton, { props: { loading: true } });
    expect(wrapper.find("svg").exists()).toBe(true);
  });

  it("hides spinner when loading=false", () => {
    const wrapper = mount(BaseButton, { props: { loading: false } });
    expect(wrapper.find("svg").exists()).toBe(false);
  });

  it("is disabled when loading=true", () => {
    const wrapper = mount(BaseButton, { props: { loading: true } });
    expect(wrapper.get("button").attributes("disabled")).toBeDefined();
  });

  it("is disabled when disabled=true", () => {
    const wrapper = mount(BaseButton, { props: { disabled: true } });
    expect(wrapper.get("button").attributes("disabled")).toBeDefined();
  });

  it("is not disabled by default", () => {
    const wrapper = mount(BaseButton);
    expect(wrapper.get("button").attributes("disabled")).toBeUndefined();
  });
});
