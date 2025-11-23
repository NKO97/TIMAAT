package de.bitgilde.TIMAAT.storage.entity;

import de.bitgilde.TIMAAT.db.DbAccessComponent;
import de.bitgilde.TIMAAT.model.FIPOP.CategorySet;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManagerFactory;

import java.util.List;

/**
 * Storage to access or modify category set entities
 *
 * @author Nico Kotlenga
 * @since 21.11.25
 */
public class CategorySetStorage extends DbAccessComponent {

  @Inject
  public CategorySetStorage(EntityManagerFactory emf) {
    super(emf);
  }

  public List<CategorySet> getCategorySetsAssignedToCategory(int categoryId) {
    return executeDbTransaction(entityManager -> entityManager.createQuery(
            "select categorySet from CategorySet categorySet join categorySet.categorySetHasCategories categorySetHasCategories where  categorySetHasCategories.category.id = :categoryId",
            CategorySet.class).setParameter("categoryId", categoryId).getResultList());
  }
}
