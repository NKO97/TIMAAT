package de.bitgilde.TIMAAT.storage.entity;

import de.bitgilde.TIMAAT.db.DbStorage;
import de.bitgilde.TIMAAT.db.exception.DbTransactionExecutionException;
import de.bitgilde.TIMAAT.model.FIPOP.Tag;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManagerFactory;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * This storage is responsible to access and modify tags
 *
 * @author Nico Kotlenga
 * @since 20.09.25
 */
public class TagStorage extends DbStorage {

  @Inject
  public TagStorage(EntityManagerFactory emf) {
    super(emf);
  }

  public List<Tag> getOrCreateTagsHavingNames(Collection<String> tagNames) throws DbTransactionExecutionException {
    return executeDbTransaction(entityManager -> {
      Map<String, Tag> tagsByName = entityManager.createQuery("SELECT t FROM Tag t WHERE t.name IN :tagNames", Tag.class)
                                                 .setParameter("tagNames", tagNames).getResultStream()
                                                 .collect(Collectors.toMap(Tag::getName, tag -> tag));
      List<Tag> result = new ArrayList<>(tagNames.size());
      for (String tagName : tagNames) {
        if (tagsByName.containsKey(tagName)) {
          result.add(tagsByName.get(tagName));
        }
        else {
          Tag createdTag = new Tag();
          createdTag.setName(tagName);
          entityManager.persist(createdTag);

          result.add(createdTag);
        }
      }

      return result;
    });
  }
}
