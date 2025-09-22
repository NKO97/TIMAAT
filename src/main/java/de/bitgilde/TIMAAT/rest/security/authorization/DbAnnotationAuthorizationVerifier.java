package de.bitgilde.TIMAAT.rest.security.authorization;

import de.bitgilde.TIMAAT.db.DbAccessComponent;
import de.bitgilde.TIMAAT.db.exception.DbTransactionExecutionException;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.NoResultException;

/**
 * This class contains functionalities to prove if a user has permission to access specific {@link de.bitgilde.TIMAAT.model.FIPOP.Annotation}s
 * Annotations are part of a {@link de.bitgilde.TIMAAT.model.FIPOP.MediumAnalysisList}. So a verification is necessary
 * before performing updates or pass annotation information to a client.
 *
 * @author Nico Kotlenga
 * @since 21.09.25
 */
public class DbAnnotationAuthorizationVerifier extends DbAccessComponent implements AnnotationAuthorizationVerifier {

  @Inject
  public DbAnnotationAuthorizationVerifier(EntityManagerFactory emf) {
    super(emf);
  }

  public boolean verifyAuthorizationToAnnotation(int annotationId, int userId, PermissionType permissionType) throws DbTransactionExecutionException {
    return executeDbTransaction(entityManager -> {
      try {
        int userPermissionLevel = entityManager.createQuery(
                                                       "select ual.permissionType.id from UserAccountHasMediumAnalysisList ual where ual.userAccount.id = :userId and ual.mediumAnalysisList.id = (select annotation.mediumAnalysisList.id from Annotation annotation where annotation.id = :annotationId)",
                                                       Integer.class).setParameter("userId", userId).setParameter("annotationId", annotationId)
                                               .getSingleResult();
        return userPermissionLevel >= permissionType.getLevel();
      } catch (NoResultException noResultException) {
        return false;
      }
    });
  }

}
