package com.knowit.erozgaar.entities;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="users")
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private int id;
	
	@Column(name="user_name")
	private String userName;
	
	@JsonIgnore
	@Column(name="password")
	private String password;
	

	@Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "gender")
    private String gender;
	
	@ManyToOne
	@JoinColumn(name="role_id")
	private Role role;
	
	@Column(name="active")
	private int active;

	@Column(name = "adhaar")
	private String adhaar;

	@Column(name = "account_number")
	private String accountNumber;

	@ManyToOne
	@JoinColumn(name="security_question_id")
	private SecurityQuestion securityQuestion;

	@Column(name = "answer")
	private String answer;

	public User() {
		super();
	}

	public User(String userName, String password, String phoneNumber, String gender, Role role, int active,
			String adhaar, String accountNumber, SecurityQuestion securityQuestion, String answer) {
		this.userName = userName;
		this.password = password;
		this.phoneNumber = phoneNumber;
		this.gender = gender;
		this.role = role;
		this.active = active;
		this.adhaar = adhaar;
		this.accountNumber = accountNumber;
		this.securityQuestion = securityQuestion;
		this.answer = answer;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public int getActive() {
		return active;
	}

	public void setActive(int active) {
		this.active = active;
	}

	public String getAdhaar() {
		return adhaar;
	}

	public void setAdhaar(String adhaar) {
		this.adhaar = adhaar;
	}

	public String getAccountNumber() {
		return accountNumber;
	}

	public void setAccountNumber(String accountNumber) {
		this.accountNumber = accountNumber;
	}

	public String getAnswer() {
		return answer;
	}

	public void setAnswer(String answer) {
		this.answer = answer;
	}

	public SecurityQuestion getSecurityQuestion() {
		return securityQuestion;
	}

	public void setSecurityQuestion(SecurityQuestion securityQuestion) {
		this.securityQuestion = securityQuestion;
	}

}