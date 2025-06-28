import { Component, EventEmitter, Output, signal } from "@angular/core";
import { colorModels, namedColorModels } from "../../model/color-models-definitions";
import { ColorComponent, ColorConfig, ColorModel } from "../../model/colors.model";
import { CollapseVerticalDirective } from "../../../core/directives/collapse-vertical.directive";
import { ContainerDirective } from "../../../core/directives/containers/container.directive";

@Component({
  selector: "zz-color-menu",
  imports: [CollapseVerticalDirective, ContainerDirective],
  templateUrl: "./color-menu.component.html",
  styleUrl: "./color-menu.component.css",
})
export class ColorMenuComponent {
  models = colorModels;

  currentModel = signal(namedColorModels["oklch"]);
  currentVariable = signal(this.currentModel().components[this.currentModel().defaultVariableIndex]);
  currentVariableIndex = signal(
    this.currentModel().components.findIndex(
      (c) => c.name === this.currentModel().components[this.currentModel().defaultVariableIndex].name
    ) as 0 | 1 | 2
  );

  @Output() colorConfigChange = new EventEmitter<ColorConfig>();

  ngOnInit() {
    const defaultModel = this.currentModel();

    this.colorConfigChange.emit({
      model: defaultModel,
      variable: defaultModel.components[defaultModel.defaultVariableIndex],
      variableIndex: defaultModel.components.findIndex(
        (c) => c.name === defaultModel.components[defaultModel.defaultVariableIndex].name
      ) as 0 | 1 | 2,
    });
  }

  modelSelected(model: ColorModel) {
    this.currentModel.set(model);
    this.currentVariable.set(model.components[model.defaultVariableIndex]);
    this.currentVariableIndex.set(
      model.components.findIndex((c) => c.name === model.components[model.defaultVariableIndex].name) as 0 | 1 | 2
    );

    this.colorConfigChange.emit({
      model: model,
      variable: model.components[model.defaultVariableIndex],
      variableIndex: model.components.findIndex((c) => c.name === model.components[model.defaultVariableIndex].name) as
        | 0
        | 1
        | 2,
    });
  }
  variableSelected(variable: ColorComponent) {
    this.currentVariable.set(variable);
    this.currentVariableIndex.set(
      this.currentModel().components.findIndex((c) => c.name === variable.name) as 0 | 1 | 2
    );

    this.colorConfigChange.emit({
      model: this.currentModel(),
      variable: variable,
      variableIndex: this.currentModel().components.findIndex((c) => c.name === variable.name) as 0 | 1 | 2,
    });
  }
}
