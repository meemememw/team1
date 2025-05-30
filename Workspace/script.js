let members = {}; // 더 이상 클라이언트 측에서 회원 정보를 직접 저장하지 않습니다.

function signup() {
  const id = document.getElementById("signup-id").value;
  const pw = document.getElementById("signup-pw").value;
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;

  if (id && pw && name && email) {//&&true
    fetch('/user/signup', { //fetch() 괄호안은 엔드포인트\
      method: 'POST',//클라이언트로부터 회원가입 요청을 받는것. 이 요청에는 아이디 비밀번호 이름 이메일등의 회원정보
      headers: { //요청본문에 담긴 데이터의 형식을 알려줌 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, password: pw, name, email }), //요청의 본문을 데이터에 담아서 서버로 보냄
    })
    .then(response => response.json()) //첫번째 then은 성공됬을때 실행
    .then(data => { //두번쨰 then은 json 파싱 프로미스가 성공 했을 때 실행되며 파싱된 자바스크립트 객체 data를 받습니다 data는 더이상 프로미스가 아닙니다
      if (response.ok) {
        alert(data.message);
        fetchMemberList();
        clearSignupForm();
      } else {
        alert(data.message);
      }
    })
    .catch(error => {
      console.error('회원 가입 오류:', error);
      alert('회원 가입 중 오류가 발생했습니다.');
    });
  } else {
    alert("모든 정보를 입력해주세요.");
  }
}

function clearSignupForm() {
  document.getElementById("signup-id").value = "";
  document.getElementById("signup-pw").value = "";
  document.getElementById("signup-name").value = "";
  document.getElementById("signup-email").value = "";
}

function fetchMemberList() {
  fetch('/ubuntu08/api/v1/user/list') //url오류
    .then(response => response.json())
    .then(data => {
      const memberSelect = document.getElementById("member-select");
      memberSelect.innerHTML = '<option value="">-- 선택하세요 --</option>';
      data.forEach(member => {
        const option = document.createElement("option");
        option.value = member.id;
        option.textContent = `${member.id} (${member.name})`;
        memberSelect.appendChild(option);//멤버 셀렉트 끝으로
      });
      hideMemberDetail(); //스타일에서 none 값 출력함
      hideUpdateForm(); //마찬가지지
    })
    .catch(error => {
      console.error('회원 목록 조회 오류:', error);
      alert('회원 목록을 불러오는 중 오류가 발생했습니다.');
    });
}

function showMemberDetail() {
  const memberId = document.getElementById("member-select").value;
  if (memberId) {
    fetch(`/user/${memberId}`)
      .then(response => response.json())
      .then(data => {
        if (response.ok) {
          document.getElementById("detail-id").textContent = `아이디: ${data.id}`;
          document.getElementById("detail-name").textContent = `이름: ${data.name}`;
          document.getElementById("detail-email").textContent = `이메일: ${data.email}`;
          document.getElementById("member-detail").style.display = "block";
          document.getElementById("update-id").value = data.id;
        } else {
          alert(data.message);
          hideMemberDetail();
          hideUpdateForm();
        }
      })
      .catch(error => {
        console.error('회원 정보 조회 오류:', error);
        alert('회원 정보를 불러오는 중 오류가 발생했습니다.');
      });
  } else {
    hideMemberDetail();
    hideUpdateForm();
  }
}

function hideMemberDetail() {
  document.getElementById("member-detail").style.display = "none";
}//안보이게함

function showUpdateForm() {
  const memberId = document.getElementById("member-select").value;
  if (memberId) {
    fetch(`/user/${memberId}`)
      .then(response => response.json())
      .then(data => {
        if (response.ok) {
          document.getElementById("update-pw").value = data.password || ''; // 비밀번호가 없을 수도 있으므로 처리
          document.getElementById("update-name").value = data.name;
          document.getElementById("update-email").value = data.email;1111
          document.getElementById("update-form").style.display = "block";
        } else {
          alert(data.message);
          hideUpdateForm();
        }
      })
      .catch(error => {
        console.error('회원 정보 조회 오류:', error);
        alert('수정 폼을 불러오는 중 오류가 발생했습니다.');
      });
  }
}

function hideUpdateForm() {
  document.getElementById("update-form").style.display = "none";
}

function updateMemberInfo() {
  const id = document.getElementById("update-id").value;
  const pw = document.getElementById("update-pw").value;
  const name = document.getElementById("update-name").value;
  const email = document.getElementById("update-email").value;

  if (id && name && email) { // 비밀번호는 필수가 아닐 수 있음
    fetch(`/user/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: pw, name, email }),
    })
    .then(response => response.json())
    .then(data => {
      if (response.ok) {
        alert(data.message);
        fetchMemberList(); // 수정 후 목록 업데이트
        hideUpdateForm();
        showMemberDetail(); // 수정된 정보 다시 보여주기
      } else {
        alert(data.message);
      }
    })
    .catch(error => {
      console.error('회원 정보 수정 오류:', error);
      alert('회원 정보 수정 중 오류가 발생했습니다.');
    });
  } else {
    alert("아이디, 이름, 이메일은 필수 정보입니다.");
  }
}

function deleteMember() {
  const memberId = document.getElementById("member-select").value;
  if (memberId) {
    if (confirm(`${document.getElementById('detail-name').textContent.split(': ')[1]}님을 탈퇴시키겠습니까?`)) {
      fetch(`/user/${memberId}`, {
        method: 'DELETE',
      })
      .then(response => response.json())
      .then(data => {
        if (response.ok) {
          alert(data.message);
          fetchMemberList(); // 삭제 후 목록 업데이트
          hideMemberDetail();
        } else {
          alert(data.message);
        }
      })
      .catch(error => {
        console.error('회원 탈퇴 오류:', error);
        alert('회원 탈퇴 중 오류가 발생했습니다.');
      });
    }
  } else {
    alert("탈퇴할 회원을 선택해주세요.");
  }
}

// 페이지 로딩 시 서버에서 회원 목록 초기화
fetchMemberList();