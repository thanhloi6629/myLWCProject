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

  public static void updateGrade(
    List<Student__c> newStudent,
    Map<Id, Student__c> oldStudent
  ) {
    // Lấy grade của học sinh đang update
    System.debug('newStudent: ' + newStudent);
    System.debug('oldStudent: ' + oldStudent);

    if (newStudent == null || newStudent.isEmpty()) {
      return;
  }

    if (oldStudent == null || oldStudent.isEmpty()) {
        oldStudent = new Map<Id, Student__c>();
    }

    Set<String> gradeIds = new Set<String>();
    for (Student__c student : newStudent) {
      if (student.grade__c != null) {
        gradeIds.add(student.grade__c);
      }
    }

    if(oldStudent.values() != null){
      for (Student__c variable : oldStudent.values()) {
        if (variable.grade__c != null) {
          gradeIds.add(variable.grade__c);
        }
      }
    }
    // Lấy tất cả học sinh của lớp
    System.debug('gradeIds: ' + gradeIds);
    List<Grade__c> gradesToUpdate = [
      SELECT Id, Name, (SELECT status__c FROM Student__r)
      FROM Grade__c
      WHERE Id IN :gradeIds
    ]; //lookup

    if (gradesToUpdate.isEmpty()) {
      return; // Không có bản ghi nào cần cập nhật
   }

      // for danh sach học sinh, check satus tăng biến đếm đậu,
    for (Grade__c grade : gradesToUpdate) {
      Integer passCount = 0;
      Integer failCount = 0;
      for (Student__c student : grade.Student__r) {
        if (student.status__c == 'Đậu') {
          passCount++;
        } else {
          failCount++;
        }
      }
      grade.hocSinhDau__c = passCount;
      grade.hocSinhRot__c = failCount;
    }
    System.debug('gradesToUpdate: ' + gradesToUpdate);
     // update số học sinh đâu, rớt cho grade
    update gradesToUpdate;
  }
}
