public with sharing class StudentTriggerHandler {
    public static void validateStudent(List<Student__c> students) {
        System.debug(students );
        for(Student__c student : students) {
          if(student.birthday__c == null) {
            student.addError('Hãy nhập ngày sinh');
          } else {
            Integer age = calculateAge(student.birthday__c);
            if(age < 6 || age > 18) {
                student.addError('Tuổi của học sinh phải từ 6 đến 18.');
            }
          }
          if(student.diem1__c > 10) {
            student.addError('Hãy nhập điểm môn Toán nhỏ hơn 10');
          }
          if(student.diem2__c > 10) {
            student.addError('Hãy nhập điểm môn Lý nhỏ hơn 10');
          }
          if(student.diem3__c > 10) {
            student.addError('Hãy nhập điểm môn Hóa nhỏ hơn 10');
          }
        }
      } 
      private static Integer calculateAge(Date birthday) {
        Date today = Date.today();
        Integer age = today.year() - birthday.year();
        if(today.month() < birthday.month() || (today.month() == birthday.month() && today.day() < birthday.day())) {
          age--;
        }
        return age;
      }

      private static AuraHandledException handleException(String errorMessage) {
        AuraHandledException e = new AuraHandledException(errorMessage);
        e.setMessage(errorMessage);
        return e;
    }
    public class PositionException extends Exception {}
    
}