const container = document.getElementById("root") as HTMLElement;

class ProgressStepper {
  private readonly steps: number;
  private rootContainer: HTMLElement;
  private currentStep: number;
  private isOnChangeSubscribed: boolean;
  private completedPercentage: number;
  private increaseValue: number;

  constructor(props: { steps?: number; root: HTMLElement }) {
    this.steps = props.steps ?? 4;
    this.currentStep = 1;
    this.completedPercentage = 0;
    this.increaseValue = 100 / (this.steps - 1);
    this.rootContainer = this.createRoot();
    this.isOnChangeSubscribed = false;
    container.append(this.rootContainer);
  }

  public onChange(
    handler: (event: { name: "next" | "prev"; step: number }) => void
  ) {
    if (this.isOnChangeSubscribed) return;

    this.isOnChangeSubscribed = true;

    this.getActionBtn("prev").addEventListener("click", () => {
      this.getActionBtn("next").classList.remove("disabled");

      this.setCompletedStep(this.currentStep - 1, "remove");

      if (this.currentStep > 1) {
        this.completedPercentage -= this.increaseValue;
        this.currentStep -= 1;
      }

      if (this.currentStep === 1) {
        this.getActionBtn("prev").classList.add("disabled");
        this.completedPercentage = 0;
      }

      this.setProgressBarFill(this.completedPercentage);

      handler({
        name: "prev",
        step: this.currentStep,
      });
    });

    this.getActionBtn("next").addEventListener("click", () => {
      this.getActionBtn("prev").classList.remove("disabled");

      if (this.currentStep < this.steps) {
        this.currentStep += 1;
        this.completedPercentage += this.increaseValue;
      }

      if (this.currentStep === this.steps) {
        this.getActionBtn("next").classList.add("disabled");
        this.completedPercentage = 100;
      }

      this.setProgressBarFill(this.completedPercentage);
      this.setCompletedStep(this.currentStep - 1, "add");

      handler({
        name: "next",
        step: this.currentStep,
      });
    });
  }

  private createRoot() {
    function createElement(
      tagName: keyof HTMLElementTagNameMap,
      classList: string
    ) {
      const element = document.createElement(tagName);
      element.classList.add(classList);
      return element;
    }

    const container = createElement("div", "progress-root");

    const progressBar = createElement("div", "progress-bar");
    progressBar.append(createElement("div", "progress-bar-fill"));

    const progressSteps = createElement("ul", "progress-steps");

    for (let n = 0; n < this.steps; n++) {
      const number = createElement("li", "progress-steps-value");
      number.textContent = `${n + 1}`;

      if (n > 0 && n < this.steps - 1) {
        number.style.left = `calc(${
          (100 / (this.steps - 1)) * n
        }% - var(--progress-bar-number-size) / 2)`;
      }

      if (n === 0) number.classList.add("completed");

      progressSteps.append(number);
    }

    const actions = createElement("div", "progress-root-actions");
    const prev = createElement("button", "progress-action-btn");
    const next = createElement("button", "progress-action-btn");

    prev.textContent = "Prev";
    next.textContent = "Next";

    prev.setAttribute("data-action", "prev");
    next.setAttribute("data-action", "next");
    prev.classList.add("disabled");

    actions.append(prev, next);
    container.append(progressBar, progressSteps, actions);
    return container;
  }

  private setProgressBarFill(value: number) {
    (
      this.rootContainer.querySelector(".progress-bar-fill") as HTMLDivElement
    ).style.width = `${value}%`;
  }

  private setCompletedStep(step: number, action: "add" | "remove") {
    Array.from<HTMLDivElement>(
      this.rootContainer.querySelectorAll(".progress-steps-value")
    )[step].classList[action]("completed");
  }

  private getActionBtn(action: "next" | "prev") {
    return this.rootContainer.querySelector(
      `[data-action=${action}]`
    ) as HTMLButtonElement;
  }
}

const progressStepper2 = new ProgressStepper({ steps: 2, root: container });
const progressStepper3 = new ProgressStepper({ steps: 3, root: container });
const progressStepper4 = new ProgressStepper({ steps: 4, root: container });
const progressStepper5 = new ProgressStepper({ steps: 5, root: container });

progressStepper2.onChange(console.log);
progressStepper3.onChange(console.log);
progressStepper4.onChange(console.log);
progressStepper5.onChange(console.log);

console.log(progressStepper4);
