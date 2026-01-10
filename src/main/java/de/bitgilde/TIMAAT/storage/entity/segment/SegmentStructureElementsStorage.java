package de.bitgilde.TIMAAT.storage.entity.segment;

import de.bitgilde.TIMAAT.db.DbAccessComponent;
import de.bitgilde.TIMAAT.model.FIPOP.AnalysisAction;
import de.bitgilde.TIMAAT.model.FIPOP.AnalysisScene;
import de.bitgilde.TIMAAT.model.FIPOP.AnalysisSegment;
import de.bitgilde.TIMAAT.model.FIPOP.AnalysisSequence;
import de.bitgilde.TIMAAT.model.FIPOP.AnalysisTake;
import de.bitgilde.TIMAAT.model.FIPOP.Category;
import de.bitgilde.TIMAAT.model.FIPOP.CategorySetHasCategory;
import de.bitgilde.TIMAAT.model.FIPOP.SegmentStructureEntity;
import de.bitgilde.TIMAAT.storage.entity.segment.api.SegmentStructureType;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManagerFactory;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Storage responsible to access and modify {@link AnalysisSegment}s
 *
 * @author Nico Kotlenga
 * @since 31.12.25
 */
public class SegmentStructureElementsStorage extends DbAccessComponent {

  private static final Map<SegmentStructureType, Class<? extends SegmentStructureEntity>> SEGMENT_STRUCTURE_ENTITY_CLASS_BY_SEGMENT_STRUCTURE_TYPE = Map.of(
          SegmentStructureType.SEGMENT, AnalysisSegment.class, SegmentStructureType.SEQUENCE, AnalysisSequence.class,
          SegmentStructureType.TAKE, AnalysisTake.class, SegmentStructureType.SCENE, AnalysisScene.class,
          SegmentStructureType.ACTION, AnalysisAction.class);


  @Inject
  public SegmentStructureElementsStorage(EntityManagerFactory emf) {
    super(emf);
  }

  public List<Category> updateCategories(int segmentStructureId, SegmentStructureType segmentStructureType, Collection<Integer> categoryIds) {
    return executeDbTransaction(entityManager -> {
      Class<? extends SegmentStructureEntity> segmentTypeEntityClass = SEGMENT_STRUCTURE_ENTITY_CLASS_BY_SEGMENT_STRUCTURE_TYPE.get(
              segmentStructureType);

      SegmentStructureEntity segmentStructureEntity = entityManager.find(segmentTypeEntityClass, segmentStructureId);
      int mediumAnalysisListId = segmentStructureEntity.getMediumAnalysisList().getId();

      List<Category> categories = categoryIds.isEmpty() ? Collections.emptyList() : entityManager.createQuery(
              "select category from Category category where category.id in (select cshs.category.id from MediumAnalysisList mediumAnalysisList join mediumAnalysisList.categorySets categorySets join categorySets.categorySetHasCategories cshs where mediumAnalysisList.id = :mediumAnalysisListId and cshs.category.id in :categoryIds)",
              Category.class).setParameter("categoryIds", categoryIds).setParameter("mediumAnalysisListId",
              mediumAnalysisListId).getResultList();

      segmentStructureEntity.setCategories(categories);
      return categories;
    });
  }

  public List<Category> getAssignedCategories(int segmentStructureId, SegmentStructureType segmentStructureType) {
    return executeDbTransaction(entityManager -> {
      Class<? extends SegmentStructureEntity> segmentTypeEntityClass = SEGMENT_STRUCTURE_ENTITY_CLASS_BY_SEGMENT_STRUCTURE_TYPE.get(
              segmentStructureType);
      SegmentStructureEntity segmentStructureEntity = entityManager.find(segmentTypeEntityClass, segmentStructureId);
      return segmentStructureEntity.getCategories();
    });
  }

  public List<Category> getAssignableCategories(int segmentStructureId, SegmentStructureType segmentStructureType) {
    return executeDbTransaction(entityManager -> {
      Class<? extends SegmentStructureEntity> segmentTypeEntityClass = SEGMENT_STRUCTURE_ENTITY_CLASS_BY_SEGMENT_STRUCTURE_TYPE.get(
              segmentStructureType);
      SegmentStructureEntity segmentStructureEntity = entityManager.find(segmentTypeEntityClass, segmentStructureId);
      return segmentStructureEntity.getMediumAnalysisList().getCategorySets().stream()
                                   .flatMap(categorySet -> categorySet.getCategorySetHasCategories().stream())
                                   .map(CategorySetHasCategory::getCategory).collect(Collectors.toList());
    });
  }
}
