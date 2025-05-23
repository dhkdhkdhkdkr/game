// script.js 파일 내용 시작 - 컨페티 효과 생성 및 제거 로직 추가

// 게임 선택지
const choices = ['rock', 'paper', 'scissors']; // 바위, 보, 가위

// 엘리먼트 가져오기
const timerDisplay = document.getElementById('timer-display');
const startButton = document.getElementById('start-button');
const gameButtons = document.getElementById('game-buttons').querySelectorAll('button'); // 가위바위보 버튼들
const resultDisplay = document.getElementById('result');
const gameContainer = document.getElementById('game-container'); // 게임 컨테이너 엘리먼트 가져오기
const fireworksContainer = document.getElementById('fireworks-container'); // 불꽃놀이/컨페티 컨테이너 엘리먼트 가져오기


let timerInterval; // 타이머 간격을 저장할 변수
let effectTimeout; // 이펙트 제거를 위한 setTimeout 변수
let hasChosen = false; // 사용자가 선택했는지 여부를 나타내는 플래그


// 시작 버튼 이벤트 리스너
startButton.addEventListener('click', startGame);

// 가위바위보 버튼 이벤트 리스너 추가
gameButtons.forEach(button => {
    button.addEventListener('click', () => playGame(button.id));
});

// 모든 이펙트 클래스 및 파티클을 제거하는 헬퍼 함수
function clearEffects() {
     document.body.classList.remove('win-background');
     gameContainer.classList.remove('win-effect');
     resultDisplay.classList.remove('win', 'lose');
     timerDisplay.classList.remove('warning');

     // 파티클 컨테이너의 모든 자식 요소 (컨페티) 제거
     while (fireworksContainer.firstChild) {
         fireworksContainer.removeChild(fireworksContainer.firstChild);
     }
}


// 게임 시작 함수 (변경 없음)
function startGame() {
    clearEffects();
     if (effectTimeout) clearTimeout(effectTimeout);
    if (timerInterval) clearInterval(timerInterval);

    startButton.disabled = true;
    hasChosen = false;
    resultDisplay.textContent = '결과: 대기 중...';

    let timeLeft = 5;
    timerDisplay.textContent = `${timeLeft}`;
    timerDisplay.classList.remove('warning');

    gameButtons.forEach(button => button.disabled = false);

    timerInterval = setInterval(() => {
        timeLeft--;

        if (timeLeft > 0) {
            timerDisplay.textContent = `${timeLeft}`;
            if (timeLeft <= 2) {
                 timerDisplay.classList.add('warning');
            } else {
                 timerDisplay.classList.remove('warning');
            }
        } else { // timeLeft === 0
            clearInterval(timerInterval);
             timerDisplay.textContent = '0';
             timerDisplay.classList.add('warning');
            gameButtons.forEach(button => button.disabled = true);
            startButton.disabled = false;

            setTimeout(() => {
                if (!hasChosen) {
                    resultDisplay.textContent = '시간 초과로 패배했습니다... 😢';
                     resultDisplay.classList.add('lose');
                    timerDisplay.textContent = '시간 초과!';
                     timerDisplay.classList.remove('warning');
                } else {
                     timerDisplay.textContent = '게임 종료!';
                     timerDisplay.classList.remove('warning');
                }
            }, 500);
        }
    }, 1000);
}

// 게임 실행 함수 (사용자 선택 시 호출)
function playGame(userChoice) {
    if (hasChosen) {
        return;
    }

     clearEffects();
     if (effectTimeout) clearTimeout(effectTimeout);
    if (timerInterval) clearInterval(timerInterval);

    hasChosen = true;

    gameButtons.forEach(button => button.disabled = true);
    startButton.disabled = false;

    const computerChoice = choices[Math.floor(Math.random() * choices.length)];

    let result = '';
    if (userChoice === computerChoice) {
        result = '비겼습니다!';
    } else if (
        (userChoice === 'rock' && computerChoice === 'scissors') ||
        (userChoice === 'paper' && computerChoice === 'rock') ||
        (userChoice === 'scissors' && computerChoice === 'paper')
    ) {
        result = '이겼습니다! 🎉';
        resultDisplay.classList.add('win');
        document.body.classList.add('win-background');
        gameContainer.classList.add('win-effect');

        // *** 불꽃놀이 대신 컨페티 효과 생성 함수 호출 ***
        createConfetti();

        // 3초 후에 모든 이펙트 클래스 및 파티클 제거 (컨페티 애니메이션 시간에 맞춰 조정 필요)
        // 컨페티가 떨어지는 시간보다 길게 설정
        effectTimeout = setTimeout(clearEffects, 4000); // 4000ms = 4초

    } else {
        result = '졌습니다... 😢';
         resultDisplay.classList.add('lose');
    }

    resultDisplay.textContent = `당신: ${displayChoice(userChoice)}, 컴퓨터: ${displayChoice(computerChoice)}, 결과: ${result}`;
    timerDisplay.textContent = '게임 종료!';
     timerDisplay.classList.remove('warning');
}

// 컨페티 파티클을 생성하는 함수 (불꽃놀이 함수 대체)
function createConfetti() {
    const numberOfParticles = 100; // 생성할 컨페티 개수
    // 컨페티 색상들 (밝고 활기찬 테마에 맞춰 업데이트)
    const colors = [
        '#fd7e14', /* 주황 */
        '#e83e8c', /* 분홍/자주 */
        '#007bff', /* 파랑 */
        '#28a745', /* 초록 */
        '#ffc107', /* 밝은 주황 */
        '#dc3545', /* 빨강 */
        '#6f42c1', /* 보라 */
        '#20c997', /* 민트 */
        '#f0e4d4', /* 연한 아이보리 */
        '#ffeeba'  /* 연한 노랑 */
    ];

    const containerRect = gameContainer.getBoundingClientRect();
    // 컨페티 시작 위치는 gameContainer 상단 랜덤 위치
    const startY = 0; // gameContainer 상단
    const startXRange = containerRect.width; // gameContainer 너비 범위

    for (let i = 0; i < numberOfParticles; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti'); // 컨페티 클래스 사용

        // 컨페티의 시작 위치 (gameContainer 상단, 좌우 랜덤)
        const startX = Math.random() * startXRange;
        confetti.style.left = `${startX}px`;
        confetti.style.top = `${startY}px`;

        // 랜덤 색상 적용
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.backgroundColor = randomColor;

        // 랜덤하게 떨어지고 회전할 값 설정 (CSS 변수로 설정)
        const finalDistanceY = containerRect.height + 50; // gameContainer 높이 + 추가 거리만큼 아래로
        const finalDistanceX = (Math.random() - 0.5) * containerRect.width; // 좌우 랜덤 이동
        const randomRotate = Math.random() * 720 - 360; // -360도 ~ 360도 랜덤 회전

        confetti.style.setProperty('--x', `${startX}px`); // 시작 위치 X (애니메이션 기준)
        confetti.style.setProperty('--y', `${startY}px`); // 시작 위치 Y (애니메이션 기준)
        confetti.style.setProperty('--finalX', `${finalDistanceX}px`); // 최종 이동 거리 X
        confetti.style.setProperty('--finalY', `${finalDistanceY}px`); // 최종 이동 거리 Y
        confetti.style.setProperty('--rotate', `${randomRotate}deg`); // 최종 회전값

        // 애니메이션 적용 (떨어지는 시간 및 지연 랜덤 설정)
        const animationDuration = Math.random() * 1.5 + 2.5; // 2.5초 ~ 4초 사이 랜덤
        const animationDelay = Math.random() * 1; // 0초 ~ 1초 사이 랜덤 지연
        confetti.style.animation = `fall-and-rotate ${animationDuration}s ease-out ${animationDelay}s forwards`;

         // 컨페티 모양 랜덤 적용 (CSS는 직사각형만 정의했으므로 JS에서 border-radius 랜덤 적용)
         if (Math.random() < 0.5) { // 50% 확률로 원형
             confetti.style.borderRadius = '50%';
             confetti.style.width = '10px'; // 원형일 때 크기 조정
             confetti.style.height = '10px';
         }


        // 컨페티 컨테이너에 추가
        fireworksContainer.appendChild(confetti);

        // 참고: 파티클 제거는 clearEffects 함수에서 일괄 처리합니다.
    }
}


// 선택지를 한글과 이모지로 변환하는 함수 (이전과 동일)
function displayChoice(choice) {
    switch (choice) {
        case 'rock':
            return '바위 ✊';
        case 'paper':
            return '보 ✋';
        case 'scissors':
            return '가위 ✌️';
        default:
            return '';
    }
}
