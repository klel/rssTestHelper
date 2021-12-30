
//create button close to submit button
const submitBtnClassName = '.ant-btn.ant-btn-primary.ant-btn-lg';
const saveBtn = (appendTo) => {
    let button = document.createElement('button');
    //toDo  get off to a styles
    button.id = 'rssSaveCheckedAnswers';
    button.innerText = 'Save';
    // button.style.marginLeft = '10px';
    button.type = 'button';
    button.addEventListener('click', saveBtnHandler);
    document.querySelector(appendTo).after(button);
    return '#rssSaveCheckedAnswers';
};

const fillBtn = (appendTo) => {
    let button = document.createElement('button');
    //toDo  get off to a styles
    button.id = 'rssFillAnswers';
    button.innerText = 'Fill';
    // button.style.marginLeft = '10px';
    button.type = 'button';
    button.addEventListener('click', fillBtnHandler);
    document.querySelector(appendTo).before(button);
    return '#rssFillAnswers';
}


if (document.readyState !== "loading") {
    console.log('loading');
    new Promise((res) => setTimeout(() => res(saveBtn(submitBtnClassName)), 1000))
        .then(b => {
            fillBtn('#courseTaskId');
        });

} else {
    console.log('loaded');
    document.addEventListener('DOMContentLoaded', () => {
        debugger
        console.log('cont loaded');
        saveBtn(submitBtnClassName)
    }, false);
}
// const testName = document.querySelectorAll('.ant-select')[0].innerText;
// debugger
//document.querySelector('#courseTaskId').addEventListener('change', () => console.log('changed'))

//save questions with answers (to LS => to file)
//save button click handler
/**
 * {
 *   testName: {
 *               answer: value
 *             }
 * }
 * {
 *   'HTML Basics': [{
 *                    'answer-3': 3 // case1: radio
 *                  },
 *                  {
 *                    'answer-5': [1, 4, 5] //case 2: checkbox
 *                  }]
 * }
 */

//[...document.querySelectorAll('#answer-23 .ant-radio-input')][0].checked;



//when page loaded, on test chosen try to go to the LS
//and click all exist questions answers






/** approach 2
 * - when user click on radio/checkBox6 clicked value 
 * should cache to assoc array
 * in the end, clicked on "submit" btn, save cache to localstorage
 * 
*/

/**
 * Проблема. На странице тесты в дом не загружен сам тест поэтому мы не можем 
 * просто так взять и посмотреть есть ли у нас в локалсторедже ответы на предыдущий пройденный тест, 
 * т.к. не знаем какой юзер выбрал тест.
 * Как можно было бы решить:
 * 1. навесить на событие change комбо бокса с выбором теста и это было бы идеально.
 * Но почему-то
 * document.querySelector('#courseTaskId').addEventListener('change', ()=> console.log('changed'))
 * не навешивает обработчик. При этом попытка навесить на click работает, но почему-то один раз. При
 * последующих кликах не срабатывает.
 * 
 * 2. Костыль конечно, но тоже вариант ...
 * Попытка воспользоваться MutationObserver. По началу все было ок, но само приложение 
 * при каждом чихе меняет DOM... и с этим надо что-то думать. 
 */

var target = document.getElementById('__next');


const config = {
    //attributes: true,
    childList: true,
    subtree: true
};


const cashedAnswers = {};

//TODO: reason for multiple triggered and how to fix it
const mainWrapperMutationHandler = () => {
    //эта проверка нужна потому, что у matches в manifest странное поведение
    //вроде бы прописан паттерн урла только тестов, а грузится на других урлах 
    //rsapp🤦🏽‍♂️ при этом если седлать hard refresh на других урлах не видит встоенный скрипт
    //при этом не с первого раза загружается на целевом ресурсе🤷🏽‍♂️
    if (!document.URL.match('https://app.rs.school/course/student/auto-test*')) {
        return;
    }

    const testArea = [...document.querySelectorAll("main.ant-layout-content")];
    if (!testArea) {
        console.info('Target section not be founded');
        return;
    }

    testArea[0].addEventListener('change', (e) => {
        const quiz = {
            question: null,
            answer: null
        },
            target = e.target;
        //1 case - click on radio input
        if (target.type === 'radio') {
            quiz.question = target.closest('div.ant-radio-group.ant-radio-group-outline[id*=answer]').id;
            quiz.answer = target.value;
        }

        //case 2 - click on checkbox;
        if (target.type === 'checkbox') {
            const group = target.closest('.ant-checkbox-group[id*=answer]'),
                id = group.id;


            const answers = [...group.querySelectorAll('.ant-checkbox-input')]
                .filter(e => e.checked)
                .map(b => b.value);

            quiz.question = id;
            quiz.answer = answers;
        }

        cashedAnswers[quiz.question] = quiz.answer;
        console.log(cashedAnswers);
    });
}

// Создаём экземпляр наблюдателя с указанной функцией колбэка
const observer = new MutationObserver(mainWrapperMutationHandler);

// Начинаем наблюдение за настроенными изменениями целевого элемента
observer.observe(target, config);

// document.querySelector('.ant-btn.ant-btn-primary.ant-btn-lg').addEventListener(() => 

// );
const getSelectedTestName = () => {

    return [...document.querySelectorAll('.ant-select-selection-item')][0]?.innerText;
}

const saveBtnHandler = (e) => {
    const testName = getSelectedTestName();
    localStorage.setItem(testName, JSON.stringify(cashedAnswers));
};

const fillBtnHandler = (e) => {
    const test = getSelectedTestName();
    if (test) {
        markLastAnswered(test);
    }
};

const markLastAnswered = (testName) => {
    //const test = getSelectedTestName();
    const answers = JSON.parse(localStorage.getItem(testName));

    Object.entries(answers).forEach(e => {
        let key = e[0],
            value = e[1];
        if (Array.isArray(value)) {
            let group = document.querySelector('.ant-checkbox-group[id=' + key + '');
            value.forEach(v => {
                group.querySelector(`input[value= "${v}"]`).click();
            })
        } else {
            let group = document.querySelector(`.ant-radio-group-outline[id="${e[0]}"]`);
            group.querySelector(`input[value= "${e[1]}"]`).click();
        }
    });

}

//When i have to stop it?
// observer.disconnect();

