package de.bitgilde.TIMAAT.rest.security.authorization;

/**
 * This enum describes the different permission types a user can have to an {@link de.bitgilde.TIMAAT.model.FIPOP.MediumAnalysisList}
 * The permissions are defined hierarchically. Means, every higher level permission has also the permissions of the lower
 * levels
 *
 * @author Nico Kotlenga
 * @since 21.09.25
 */
public enum PermissionType {
  READ(1), WRITE(2), MODERATE(3), ADMINISTRATE(4);

  private final int level;

  PermissionType(int level) {
    this.level = level;
  }

  public int getLevel() {
    return level;
  }
}
