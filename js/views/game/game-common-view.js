import AbstractView from '../abstract-view';
import getGameStats from './game-stats-template';
import resize from '../../utils/resize';

const FRAME = {
  width: 468,
  height: 458
};
const MAX_ANSWERS = 2;

export default class GameCommonView extends AbstractView {
  constructor(level, answers) {
    super();
    this.level = level;
    this.answers = answers;
  }

  get template() {
    return `
      <section class="game">
        <p class="game__task">${this.level.task}</p>
        <form class="game__content">
          ${this.level.options.map((option, i) => `
            <div class="game__option">
              <img src="${option.src}" alt="Option ${i + 1}" width="${resize(FRAME, option).width}" height="${resize(FRAME, option).height}">
              <label class="game__answer game__answer--photo">
                <input class="visually-hidden" name="question${i + 1}" type="radio" value="photo">
                <span>Фото</span>
              </label>
              <label class="game__answer game__answer--paint">
                <input class="visually-hidden" name="question${i + 1}" type="radio" value="paint">
                <span>Рисунок</span>
              </label>
            </div>`).join(``)}
        </form>
        ${getGameStats(this.answers)}
      </section>`;
  }

  bind(element) {
    const form = element.querySelector(`.game__content`);
    const gameAnswers = form.querySelectorAll(`.game__answer input[type="radio"]`);

    const formChangeHandler = () => {
      const checkedAnswers = Array.from(gameAnswers).filter(({checked}) => checked);
      const areAllAnswered = checkedAnswers.length === MAX_ANSWERS;

      if (areAllAnswered) {
        const isCorrect = checkedAnswers
          .reduce((prev, curr, i) => {
            if (curr.value === this.level.options[i].type) {
              prev++;
            }
            return prev;
          }, 0) === MAX_ANSWERS;

        this.onAnswer(isCorrect);
      }
    };

    form.addEventListener(`change`, formChangeHandler);
  }

  onAnswer() {

  }
}

