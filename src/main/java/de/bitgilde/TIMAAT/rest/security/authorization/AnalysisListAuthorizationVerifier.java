package de.bitgilde.TIMAAT.rest.security.authorization;

import de.bitgilde.TIMAAT.db.exception.DbTransactionExecutionException;
import de.bitgilde.TIMAAT.model.FIPOP.UserAccount;
import de.bitgilde.TIMAAT.model.FIPOP.UserAccountHasMediumAnalysisList;

/**
 * This authorization verifier is responsible to verify if a user is allowed to access
 * a specific analysis list.
 *
 * @author Nico Kotlenga
 * @since 24.09.25
 */
public class AnalysisListAuthorizationVerifier {

  public boolean verifyAuthorizationToAnalysisList(int analysisListId, UserAccount userAccount, PermissionType permissionType) throws DbTransactionExecutionException {

    for(UserAccountHasMediumAnalysisList currentUserAccountHasMediumAnalysisList: userAccount.getUserAccountHasMediumAnalysisLists()) {
      if(currentUserAccountHasMediumAnalysisList.getMediumAnalysisList().getId() == analysisListId) {
        if(permissionType.getLevel() <= currentUserAccountHasMediumAnalysisList.getPermissionType().getId()){
          return true;
        }else {
          // fast return after finding the corresponding UserAccountHasMediumAnalysisList
          return false;
        }
      }
    }

    return false;
  }
}
