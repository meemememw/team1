let members = {}; // 더 이상 클라이언트 측에서 회원 정보를 직접 저장하지 않습니다.

function signup() {
  const id = document.getElementById("signup-id").value;
  const pw = document.getElementById("signup-pw").value;
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;

  if (id && pw && name && email) {
    fetch('/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, password: pw, name, email }),
    })
    .then(response => response.json())
    .then(data => {
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
  fetch('/user/list')
    .then(response => response.json())
    .then(data => {
      const memberSelect = document.getElementById("member-select");
      memberSelect.innerHTML = '<option value="">-- 선택하세요 --</option>';
      data.forEach(member => {
        const option = document.createElement("option");
        option.value = member.id;
        option.textContent = `${member.id} (${member.name})`;
        memberSelect.appendChild(option);
      });
      hideMemberDetail();
      hideUpdateForm();
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
}

function showUpdateForm() {
  const memberId = document.getElementById("member-select").value;
  if (memberId) {
    fetch(`/user/${memberId}`)
      .then(response => response.json())
      .then(data => {
        if (response.ok) {
          document.getElementById("update-pw").value = data.password || ''; // 비밀번호가 없을 수도 있으므로 처리
          document.getElementById("update-name").value = data.name;
          document.getElementById("update-email").value = data.email;
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