public with sharing class StudentTriggerHandler {
  public static void validateStudent(List<Student__c> students) {
    for (Student__c student : students) {
      if (student.birthday__c == null) {
        student.addError('Hãy nhập ngày sinh');
      } else {
        Integer age = calculateAge(student.birthday__c);
        if (age < 6 || age > 18) {
          student.addError('Tuổi của học sinh phải từ 6 đến 18.');
        }
      }
      if (student.diem1__c > 10) {
        student.addError('Hãy nhập điểm môn Toán nhỏ hơn 10');
      }
      if (student.diem2__c > 10) {
        student.addError('Hãy nhập điểm môn Lý nhỏ hơn 10');
      }
      if (student.diem3__c > 10) {
        student.addError('Hãy nhập điểm môn Hóa nhỏ hơn 10');
      }
    }
  }
  private static Integer calculateAge(Date birthday) {
      // Tính số ngày giữa ngày hiện tại và ngày sinh
      Integer daysBetween = Math.abs(Date.today().daysBetween(birthday));
      // Chia số ngày cho 365 để tính tuổi gần đúng
      Integer age = daysBetween / 365;
      return age;
  }
}
