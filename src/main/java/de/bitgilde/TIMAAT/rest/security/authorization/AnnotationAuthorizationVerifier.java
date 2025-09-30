package de.bitgilde.TIMAAT.rest.security.authorization;

/**
 * An AnnotationAuthorizationVerifier is responsible to profe if a user has permissions to access specific {@link de.bitgilde.TIMAAT.model.FIPOP.Annotation}ss
 *
 * @author Nico Kotlenga
 * @since 21.09.25
 */
public interface AnnotationAuthorizationVerifier {

  /**
   * Check if the user with the specified id has at least the specified {@link PermissionType} for the given {@link de.bitgilde.TIMAAT.model.FIPOP.Annotation}
   * @param annotationId
   * @param userId
   * @param permissionType
   * @return
   * @throws Exception
   */
  boolean verifyAuthorizationToAnnotation(int annotationId, int userId, PermissionType permissionType);
}
