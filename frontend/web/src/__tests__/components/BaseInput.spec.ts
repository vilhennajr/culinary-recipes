import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import BaseInput from "@/components/atoms/BaseInput.vue";

describe("BaseInput", () => {
  it("renders a label when provided", () => {
    const wrapper = mount(BaseInput, { props: { label: "Nome" } });
    expect(wrapper.find("label").exists()).toBe(true);
    expect(wrapper.find("label").text()).toContain("Nome");
  });

  it("does not render label when not provided", () => {
    const wrapper = mount(BaseInput);
    expect(wrapper.find("label").exists()).toBe(false);
  });

  it("shows asterisk when required=true", () => {
    const wrapper = mount(BaseInput, { props: { label: "Nome", required: true } });
    expect(wrapper.find("label").text()).toContain("*");
  });

  it("does not show asterisk when required=false", () => {
    const wrapper = mount(BaseInput, { props: { label: "Nome", required: false } });
    expect(wrapper.find("label").text()).not.toContain("*");
  });

  it("renders textarea when rows prop is provided", () => {
    const wrapper = mount(BaseInput, { props: { rows: 3 } });
    expect(wrapper.find("textarea").exists()).toBe(true);
    expect(wrapper.find("input").exists()).toBe(false);
  });

  it("renders input when rows is not provided", () => {
    const wrapper = mount(BaseInput);
    expect(wrapper.find("input").exists()).toBe(true);
    expect(wrapper.find("textarea").exists()).toBe(false);
  });

  it("renders input with correct type prop", () => {
    const wrapper = mount(BaseInput, { props: { type: "number" } });
    expect(wrapper.get("input").attributes("type")).toBe("number");
  });

  it("shows error message when error prop is provided", () => {
    const wrapper = mount(BaseInput, { props: { error: "Campo obrigat\u00f3rio" } });
    expect(wrapper.find("p").exists()).toBe(true);
    expect(wrapper.find("p").text()).toBe("Campo obrigat\u00f3rio");
  });

  it("does not show error message when no error", () => {
    const wrapper = mount(BaseInput);
    expect(wrapper.find("p").exists()).toBe(false);
  });

  it("applies error border class when error prop is provided", () => {
    const wrapper = mount(BaseInput, { props: { error: "Erro" } });
    expect(wrapper.get("input").classes()).toContain("border-red-400");
  });

  it("applies normal border class when no error", () => {
    const wrapper = mount(BaseInput);
    expect(wrapper.get("input").classes()).toContain("border-gray-300");
  });

  it("emits update:modelValue when input changes", async () => {
    const wrapper = mount(BaseInput);
    await wrapper.get("input").setValue("novo valor");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["novo valor"]);
  });

  it("emits update:modelValue from textarea when rows is set", async () => {
    const wrapper = mount(BaseInput, { props: { rows: 3 } });
    await wrapper.get("textarea").setValue("texto");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["texto"]);
  });

  it("binds modelValue to input value", () => {
    const wrapper = mount(BaseInput, { props: { modelValue: "Olá" } });
    expect((wrapper.get("input").element as HTMLInputElement).value).toBe("Olá");
  });

  it("passes placeholder to input", () => {
    const wrapper = mount(BaseInput, { props: { placeholder: "Escreva aqui..." } });
    expect(wrapper.get("input").attributes("placeholder")).toBe("Escreva aqui...");
  });
});
